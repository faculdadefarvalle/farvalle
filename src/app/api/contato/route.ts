import juice from "juice";
import "react-quill-new/dist/quill.snow.css";
import { sendResendMail } from "../../services/resend";
import { emailsDaVariavel, escapeHtml, sanitizeRichText, stripHtml } from "../../services/mail-utils";

// Destino das mensagens de contato. CONTATO_TO na Vercel define o destino;
// sem ela, vale o mesmo e-mail que o formulário antigo usava (USERMAIL) e, por fim, a secretaria.
function destinoContato() {
    const lista = emailsDaVariavel(process.env.CONTATO_TO || process.env.USERMAIL);
    return lista.length ? lista : ["secad@farvalle.edu.br"];
}

export async function POST(request: Request) {
    const { nome, sobrenome, email, tel, text } = await request.json();

    const mensagem = typeof text === "string" && text.trim() ? sanitizeRichText(text) : "<p> </p>";
    const htmlInline = juice(mensagem);

    try {
        await sendResendMail({
            to: destinoContato(),
            subject: "Novo Contato | FARVALLE",
            text: [
                "Novo Contato | FARVALLE",
                `Nome: ${nome ?? ""} ${sobrenome ?? ""}`.trim(),
                `Celular / Whatsapp: ${tel ?? ""}`,
                `E-mail: ${email ?? ""}`,
                "",
                "Mensagem:",
                stripHtml(mensagem),
            ].join("\n"),
            replyTo: typeof email === "string" ? email : undefined,
            html: `<div style="padding: 8px 10px; background: #ececec; font-family: 'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif; color: #757575;">
    <div style="max-width: 600px; margin: auto; padding: 15px 30px 25px 30px; background: white; border-radius: 4px; text-align: justify;">
        <div style="display: block; text-align: center; margin-top: 1rem; margin-bottom: 1rem;">
            <h1 style="font-size: 36px;">Novo Contato</h1>
        </div>
        <div style="font-size: 16px;"><strong>Nome:</strong> ${escapeHtml(nome)} ${escapeHtml(sobrenome)}</div>
        <div style="font-size: 16px; margin-top: 16px;"><strong>Celular / Whatsapp:</strong> ${escapeHtml(tel)}</div>
        <div style="font-size: 16px; margin-top: 16px;"><strong>E-mail:</strong> ${escapeHtml(email)}</div>
    </div>
</div>
<div style="padding: 8px 10px; background: #ececec; font-family: 'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif; color: #757575;">
    <div style="max-width: 600px; margin: auto; padding: 15px 30px 25px 30px; background: white; border-radius: 4px; text-align: justify;">
        <h2 style="text-align: center;">Mensagem</h2>
        ${htmlInline}
    </div>
</div>`,
        });
        return Response.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Falha ao enviar contato pelo Resend:", err);
        const message = err instanceof Error ? err.message : "Erro ao enviar e-mail";
        return Response.json({ error: message }, { status: 400 });
    }
}
