// Envio de e-mail pela API HTTP do Resend (https://resend.com/docs/api-reference/emails/send-email).
// Sem dependência extra: usa o fetch nativo do runtime do Next.js.
// A chave fica SOMENTE na variável de ambiente RESEND_API_KEY (nunca no código).

const RESEND_API_URL = "https://api.resend.com/emails";

export type ResendMail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
};

export type ResendResult = { id: string };

export function getResendFrom(): string {
  // Ex.: "Inscrições Farvalle <inscricoes@farvalle.edu.br>" — o domínio precisa estar verificado no Resend.
  const from = process.env.RESEND_FROM;
  if (!from) {
    throw new Error("RESEND_FROM não configurado (remetente verificado no Resend).");
  }
  return from;
}

export async function sendResendMail(mail: ResendMail): Promise<ResendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY não configurado.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: mail.from ?? getResendFrom(),
      to: Array.isArray(mail.to) ? mail.to : [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof body?.message === "string" ? body.message : `HTTP ${response.status}`;
    throw new Error(`Resend: ${message}`);
  }

  return body as ResendResult;
}
