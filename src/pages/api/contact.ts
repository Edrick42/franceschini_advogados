import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  locale?: "pt" | "en";
  consent?: string | boolean;
  botField?: string;
}

const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

function badRequest(message: string) {
  return json({ ok: false, error: message }, { status: 400 });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Honeypot — bots typically fill hidden fields
  if (payload.botField && payload.botField.trim() !== "") {
    return json({ ok: true });
  }

  if (!payload.name || payload.name.trim().length < 2) return badRequest("name");
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
    return badRequest("email");
  if (!payload.subject || payload.subject.trim().length < 2)
    return badRequest("subject");
  if (!payload.message || payload.message.trim().length < 20)
    return badRequest("message");
  if (!payload.consent) return badRequest("consent");

  const locale = payload.locale === "en" ? "en" : "pt";
  const notifyTo =
    import.meta.env.CONTACT_NOTIFY_EMAIL ?? "contato@franceschiniadvogados.com.br";
  const apiKey = import.meta.env.RESEND_API_KEY;

  const summary = `[${locale.toUpperCase()}] ${payload.subject}`.slice(0, 160);
  const body = [
    `Nome: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Telefone: ${payload.phone}` : null,
    `Idioma: ${locale}`,
    "",
    "Mensagem:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    console.log("[contact] (no Resend API key) would send:", { summary, body, notifyTo });
    return json({ ok: true, note: "dev-mode-no-resend" });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "Franceschini Advogados <site@franceschiniadvogados.com.br>",
      to: notifyTo,
      replyTo: payload.email,
      subject: summary,
      text: body,
    });
    if (result.error) {
      console.error("[contact] resend error", result.error);
      return json({ ok: false, error: "send" }, { status: 502 });
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected", err);
    return json({ ok: false, error: "unexpected" }, { status: 500 });
  }
};
