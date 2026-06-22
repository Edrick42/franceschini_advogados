import type { APIRoute } from "astro";

export const prerender = false;

/* Decap CMS GitHub OAuth — step 2: exchange code for access token, then
   post message back to /admin window. */
export const GET: APIRoute = async ({ url, request }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) return new Response("Missing code", { status: 400 });

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response("GitHub OAuth not configured", { status: 500 });
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieState = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith("decap_oauth_state="))
    ?.split("=")[1];
  if (!state || !cookieState || state !== cookieState) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  let token: string | null = null;
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };
    if (data.access_token) token = data.access_token;
    else console.error("[callback] github error", data);
  } catch (err) {
    console.error("[callback] exchange failed", err);
  }

  const payload = token
    ? { token, provider: "github" }
    : { error: "auth_failed" };
  const status = token ? "success" : "error";
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;

  const safeMessage = JSON.stringify(message);
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Autorizando…</title></head>
<body>
<script>
(function(){
  function receiveMessage(e) {
    if (!e.source) return;
    e.source.postMessage(${safeMessage}, e.origin);
    window.close();
  }
  window.addEventListener("message", receiveMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  } else {
    document.body.innerText = "Autenticação concluída. Você pode fechar esta janela.";
  }
})();
</script>
</body></html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "decap_oauth_state=; Path=/api; Max-Age=0",
    },
  });
};
