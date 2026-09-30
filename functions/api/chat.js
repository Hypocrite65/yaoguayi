/**
 * functions/api/chat.js — AI 对话服务端代理（Cloudflare Pages Function）
 *
 * 统一走同源 /api/chat，避免浏览器直连第三方 API 的 CORS 问题。
 * Key 优先级：请求体里的用户自定义配置（存在浏览器 localStorage）> 环境变量。
 * 这样访客填自己的免费 Key 就能用，不必等站长配置服务端 Secret。
 *
 * 请求体: { messages, stream?, apiKey?, apiBase?, model?, provider? }
 * provider: 'agnes' | 'openai' | 'custom' 走 OpenAI 兼容接口；
 *           'anthropic' 走 Anthropic Messages 接口（服务端做 SSE 格式转换）。
 */

const DEFAULT_BASE = 'https://apihub.agnes-ai.com/v1';
const DEFAULT_MODEL = 'agnes-2.0-flash';

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {};
  if (origin && (origin.endsWith('yaoguayi.com') || origin.includes('localhost'))) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) }
  });
}

export async function onRequestOptions(context) {
  const { request } = context;
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      ...corsHeaders(request)
    }
  });
}

/** 校验用户自填的 API 地址，防 SSRF：只允许公网 http(s)，拒绝内网/回环/元数据地址 */
function isSafeApiBase(url) {
  let u;
  try {
    u = new URL(String(url).trim());
  } catch {
    return false;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
  const host = u.hostname.toLowerCase();
  if (!host) return false;
  if (host === 'localhost' || host === '::1' || host === '[::1]') return false;
  if (host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return false;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0)/.test(host)) return false;
  const m172 = /^172\.(\d+)\./.exec(host);
  if (m172 && +m172[1] >= 16 && +m172[1] <= 31) return false;
  if (/^[0-9a-f:]+$/.test(host) && host !== '::1') return false; // 其他 IPv6 字面量一律拒绝
  return true;
}

/** OpenAI 兼容的 image_url 内容块 -> Anthropic image 内容块 */
function toAnthropicContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map(p => {
    if (p && p.type === 'image_url' && p.image_url && p.image_url.url) {
      const m = /^data:(.+?);base64,(.+)$/.exec(p.image_url.url);
      if (m) return { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } };
      return { type: 'text', text: '[图片]' };
    }
    if (p && p.type === 'text') return { type: 'text', text: p.text || '' };
    return { type: 'text', text: '' };
  });
}

const sseHeaders = request => ({
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no',
  ...corsHeaders(request)
});

/** Anthropic SSE 事件流 -> OpenAI 风格 data 行，前端解析逻辑无需改动 */
function anthropicToOpenAIStream(upstreamBody) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  let buf = '';
  let curEvent = '';
  const ts = new TransformStream({
    transform(chunk, controller) {
      buf += dec.decode(chunk, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('event:')) {
          curEvent = t.slice(6).trim();
          continue;
        }
        if (!t.startsWith('data:')) continue;
        const data = t.slice(5).trim();
        if (curEvent === 'content_block_delta') {
          try {
            const j = JSON.parse(data);
            const text = j.delta && j.delta.text;
            if (text) {
              controller.enqueue(enc.encode('data: ' + JSON.stringify({ choices: [{ delta: { content: text } }] }) + '\n\n'));
            }
          } catch { /* 忽略坏分片 */ }
        } else if (curEvent === 'message_stop') {
          controller.enqueue(enc.encode('data: [DONE]\n\n'));
        }
      }
    },
    flush(controller) {
      controller.enqueue(enc.encode('data: [DONE]\n\n'));
    }
  });
  return upstreamBody.pipeThrough(ts);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, request);
  }

  const messages = data.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Missing messages array' }, 400, request);
  }

  // 用户自定义配置优先，其次环境变量，最后内置默认
  const provider = data.provider || 'openai';
  const apiKey = data.apiKey || env.AI_API_KEY;
  const apiBase = data.apiBase || env.AI_API_BASE || DEFAULT_BASE;
  const model = data.model || env.AI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return json({ error: 'AI service not configured' }, 503, request);
  }
  if (!isSafeApiBase(apiBase)) {
    return json({ error: 'Invalid API base URL' }, 400, request);
  }
  const base = String(apiBase).trim().replace(/\/+$/, '');

  try {
    // ---- Anthropic 原生接口 ----
    if (provider === 'anthropic') {
      let system = '';
      const msgs = [];
      for (const m of messages) {
        if (m.role === 'system') {
          system += (system ? '\n' : '') + (typeof m.content === 'string' ? m.content : '');
          continue;
        }
        msgs.push({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: toAnthropicContent(m.content)
        });
      }
      const upstream = await fetch(base + '/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          ...(system ? { system } : {}),
          messages: msgs,
          stream: true
        })
      });
      if (!upstream.ok) {
        const errBody = await upstream.text();
        return json({ error: `Upstream error: ${errBody}` }, upstream.status, request);
      }
      return new Response(anthropicToOpenAIStream(upstream.body), { headers: sseHeaders(request) });
    }

    // ---- OpenAI 兼容接口（Agnes / OpenAI / 硅基流动 / DeepSeek 等自定义） ----
    const upstream = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, stream: true })
    });
    if (!upstream.ok) {
      const errBody = await upstream.text();
      return json({ error: `Upstream error: ${errBody}` }, upstream.status, request);
    }
    return new Response(upstream.body, { headers: sseHeaders(request) });
  } catch (err) {
    return json({ error: `Connection failed: ${err.message}` }, 502, request);
  }
}
