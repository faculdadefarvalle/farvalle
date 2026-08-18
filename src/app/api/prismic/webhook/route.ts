import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

type PrismicWebhookBody = {
  secret?: string;
};

export async function POST(req: Request) {
  let body: PrismicWebhookBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  const webhookSecret =
    process.env.PRISMIC_WEBHOOK_SECRET || process.env.PRISMIC_ACCESS_TOKEN;

  if (!webhookSecret || body.secret !== webhookSecret) {
    return NextResponse.json(
      { error: "Acesso negado, o segredo do webhook está incorreto." },
      { status: 401 },
    );
  }

  revalidateTag("prismic");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
