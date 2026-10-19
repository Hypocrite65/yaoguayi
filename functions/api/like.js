/**
 * functions/api/like.js — 文章"认可"计数接口（Cloudflare Pages Function）
 *
 * 同源 /api/like，无需 CORS。计数存在 Workers KV（绑定名 LIKES_KV）。
 *
 * GET  /api/like?slug=learn/bagua   → { slug, count }
 * POST /api/like  { slug }          → { slug, count, voted }
 *
 * 防刷：同一 IP 对同一 slug 30 天内只计一次（无登录体系下的最简方案；
 * 同一出口 IP 的多人/频繁换 IP 仍可能多计或少计，这是已知上限）。
 * 并发说明：计数是 read-modify-write，高并发下可能丢一次 +1，
 * 点赞场景可接受；如需强一致再上 Durable Object。
 */

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

async function sha256hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function cleanSlug(raw) {
  const s = String(raw || '').trim().toLowerCase();
  return /^[a-z0-9][a-z0-9/_-]{0,119}$/.test(s) ? s : null;
}

export async function onRequest({ request, env }) {
  const kv = env.LIKES_KV;
  if (!kv) return json({ error: 'likes store not configured' }, 503);

  const url = new URL(request.url);
  let slug = cleanSlug(url.searchParams.get('slug'));

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const b = cleanSlug(body && body.slug);
      if (b) slug = b;
    } catch (e) { /* 忽略非法 JSON，用 query 里的 slug */ }
  }
  if (!slug) return json({ error: 'bad slug' }, 400);

  const countKey = `count:${slug}`;
  const readCount = async () => parseInt((await kv.get(countKey)) || '0', 10) || 0;

  if (request.method === 'GET') {
    return json({ slug, count: await readCount() });
  }

  if (request.method === 'POST') {
    const ip = request.headers.get('CF-Connecting-IP')
      || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
      || 'unknown';
    const votedKey = `voted:${slug}:${await sha256hex(slug + ':' + ip)}`;
    const already = await kv.get(votedKey);
    let count = await readCount();
    if (!already) {
      count += 1;
      await kv.put(countKey, String(count));
      // 全站累计：任何 slug 的新增投票都 +1（非原子，点赞场景可接受）
      const totalKey = 'count:__total';
      const total = (parseInt((await kv.get(totalKey)) || '0', 10) || 0) + 1;
      await kv.put(totalKey, String(total));
      await kv.put(votedKey, '1', { expirationTtl: 30 * 24 * 3600 });
    }
    return json({ slug, count, voted: true });
  }

  return json({ error: 'method not allowed' }, 405);
}

/* 触发重新部署：使 LIKES_KV 绑定生效 */
