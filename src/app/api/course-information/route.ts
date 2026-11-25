import { sendResendMail } from "../../services/resend";
import { emailsDaVariavel, escapeHtml } from "../../services/mail-utils";

// Pedido de informações sobre um curso (lead).
// LEAD_TO define o destino; sem ela, vale o mesmo e-mail que o formulário antigo usava (USERMAIL) e, por fim, a secretaria.
// LEAD_CC mantém a cópia que já existia para a ouvidoria (pode ser trocada ou esvaziada na Vercel).
function destinoLead() {
    const lista = emailsDaVariavel(process.env.LEAD_TO || process.env.USERMAIL);
    return lista.length ? lista : ["secad@farvalle.edu.br"];
}

function copiaLead() {
    if (process.env.LEAD_CC !== undefined) return emailsDaVariavel(process.env.LEAD_CC);
    return ["ouvidoria@fazag.edu.br"];
}

const SITE = "https://www.farvalle.edu.br";

export async function POST(request: Request) {
    const { nome, email, telefone, text, curso } = await request.json();
    const whats = String(telefone ?? "").replace(/\D/g, "");

    try {
        await sendResendMail({
            to: destinoLead(),
            cc: copiaLead(),
            subject: "🗣️ Lead Informação | Nova mensagem 🗣️",
            text: [
                "Lead Informação | FARVALLE",
                `Nome: ${nome ?? ""}`,
                `E-mail: ${email ?? ""}`,
                `Telefone: ${telefone ?? ""}`,
                `Curso: ${curso ?? ""}`,
                text ? `\nMensagem: ${String(text)}` : "",
            ].join("\n"),
            replyTo: typeof email === "string" ? email : undefined,
            html: `<div style="padding: 50px 10px; background: #3f4c41; font-family: 'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif; color: #757575;">
    <div style="max-width: 600px; margin: auto; padding: 15px 30px 25px 30px; background: white; border-radius: 4px; text-align: justify;">
        <div style="display: block; text-align: center; margin-top: 1rem; margin-bottom: 1rem;">
            <img src="${SITE}/farvalle-logo.png" alt="Logo da Farvalle" width="150" />
            <h1>Lead Informação</h1>
        </div>
        <p><strong>Nome: </strong><br/>${escapeHtml(nome)}</p><hr />
        <p><strong>E-mail: </strong><br/>${escapeHtml(email)}</p><hr />
        <p><strong>Telefone: </strong><br/>${escapeHtml(telefone)}</p><hr />
        <p><strong>Curso: </strong><br/>${escapeHtml(curso)}</p><hr />
        ${text ? `<p><strong>Mensagem: </strong><br/>${escapeHtml(text)}</p><hr />` : ""}
    </div>
    ${whats ? `<div style="margin-top: 3rem; width: 100%; height: 50px; text-align: center;">
        <a href="https://wa.me/${whats.length <= 11 ? "55" + whats : whats}?text=Ol%C3%A1!" style="text-decoration: none; text-align: center; background: #a15f40; padding: 1rem; border-radius: 50px; color: #fff; font-weight: 600; font-size: 1rem;">Entrar em contato (Whatsapp)</a>
    </div>` : ""}
</div>`,
        });
        return Response.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Falha ao enviar lead pelo Resend:", err);
        const message = err instanceof Error ? err.message : "Erro ao enviar e-mail";
        return Response.json({ error: message }, { status: 400 });
    }
}
