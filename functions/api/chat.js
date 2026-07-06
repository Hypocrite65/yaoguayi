export async function onRequestOptions(context) {
  const { request } = context;
  const origin = request.headers.get("Origin") || "";
  
  // Set CORS headers for preflight requests
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (origin && (origin.endsWith("yaoguayi.com") || origin.includes("localhost"))) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return new Response(null, {
    status: 204,
    headers: headers,
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin") || "";

  // Get AI configuration from Cloudflare env variables
  const AI_API_KEY = env.AI_API_KEY;
  const AI_API_BASE = env.AI_API_BASE || "https://apihub.agnes-ai.com/v1";
  const AI_MODEL = env.AI_MODEL || "agnes-2.0-flash";

  // Build standard CORS headers
  const corsHeaders = {};
  if (origin && (origin.endsWith("yaoguayi.com") || origin.includes("localhost"))) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  if (!AI_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 503,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  try {
    const data = await request.json();
    const messages = data.messages;
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Missing messages array" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    const model = data.model || AI_MODEL;
    const upstreamUrl = `${AI_API_BASE.replace(/\/$/, "")}/chat/completions`;

    // Forward the request to the upstream LLM API
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      return new Response(JSON.stringify({ error: `Upstream error: ${errBody}` }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    // Stream the SSE response back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        ...corsHeaders
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `Connection failed: ${err.message}` }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
}
