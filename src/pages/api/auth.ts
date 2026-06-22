import type { APIRoute } from "astro";

export const prerender = false;

/* Decap CMS GitHub OAuth — step 1: redirect user to GitHub authorize URL.
   See https://decapcms.org/docs/github-backend/ for the protocol. */
export const GET: APIRoute = ({ url, redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
  }

  const provider = url.searchParams.get("provider") ?? "github";
  if (provider !== "github") {
    return new Response("Unsupported provider", { status: 400 });
  }

  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state,
  });

  const cookie = [
    `decap_oauth_state=${state}`,
    "Path=/api",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
      "Set-Cookie": cookie,
    },
  });
};
