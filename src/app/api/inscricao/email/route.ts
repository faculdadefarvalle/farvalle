import { sendResendMail } from "../../../services/resend";
import juice from "juice";
import "react-quill-new/dist/quill.snow.css"

// Destino oficial das inscrições (secretaria acadêmica). Pode ser sobrescrito por INSCRICAO_TO na Vercel.
const INSCRICAO_TO_PADRAO = "secad@farvalle.edu.br";

function stripHtml(html: string) {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}

// Campos digitados pelo candidato entram no HTML do e-mail como texto (evita HTML injetado).
function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {

    const {nome: nomeRaw, email, tel: telRaw, text, course: courseRaw, city: cityRaw, ingresso: ingressoRaw, conheceu: conheceuRaw} = await request.json()

    const nome = escapeHtml(nomeRaw)
    const tel = escapeHtml(telRaw)
    const emailHtml = escapeHtml(email)
    const course = escapeHtml(courseRaw)
    const city = escapeHtml(cityRaw)
    const ingresso = escapeHtml(ingressoRaw)
    const conheceu = escapeHtml(conheceuRaw)

    const inscricaoTo = process.env.INSCRICAO_TO || INSCRICAO_TO_PADRAO
    const redacao = typeof text === "string" && text.trim() ? text : "<p> </p>"
    const htmlInline = juice(redacao)

    const textoSimples = [
        "Nova Inscrição | FARVALLE",
        `Nome: ${nomeRaw ?? ""}`,
        `Celular / Whatsapp: ${telRaw ?? ""}`,
        `E-mail: ${email ?? ""}`,
        `Cidade: ${cityRaw ?? ""}`,
        `Como conheceu a FARVALLE: ${conheceuRaw ?? ""}`,
        `Forma de Ingresso: ${ingressoRaw ?? ""}`,
        `Curso desejado: ${courseRaw ?? ""}`,
        "",
        "Redação:",
        stripHtml(redacao),
    ].join("\n")

    try {
        await sendResendMail({
           to: inscricaoTo,
           subject: '🗣️ Nova Inscrição | FARVALLE 🗣️',
           text: textoSimples,
           replyTo: email,
           html: `    <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <a href="https://www.farvalle.edu.br/">
                <img src="https://www.farvalle.edu.br/images/novainscricao.jpg" style="border-radius: 16px;" alt="Logo da Farvalle" width=600px />
           </a>


               <h1 style="font-size: 36px;">Nova Inscrição</h1>
               </div>

               <div style="font-size: 16px;">
                    <strong>Nome:</strong> ${nome}
               </div>
               <div style="font-size: 16px; margin-top: 16px;">
                <strong>Celular / Whatsapp:</strong> ${tel}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>E-mail:</strong> ${emailHtml}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Cidade:</strong> ${city}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Como conheceu a FARVALLE:</strong> ${conheceu}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Forma de Ingresso:</strong> ${ingresso}
            </div>
            <div style="font-size: 16px; margin-top: 16px;">
                <strong>Curso desejado:</strong> ${course}
            </div>
               </div>

           </div>

           <div style=" padding: 8px 10px;
           background: #ececec;
           font-family:'Open Sans','Roboto','Helvetica Neue','Helvetica','Arial', sans-serif;
           color: #757575;">
               <div style="max-width: 600px;
               margin: auto;
           padding: 15px 30px 25px 30px;
           background: white;
           border-radius: 4px;
           text-align: justify;">
               <div style="
           display: block;
           text-align: center;
           margin-top: 1rem;
           margin-bottom: 1rem;">
           <h2 style="text-align: center;"> Redação </h2>

           ${htmlInline}
        </div>
        </div>
        </div>`,
        })
        return Response.json({success: true}, {status: 200})
       }catch(err){
           console.error("Falha ao enviar inscrição pelo Resend:", err)
           const message = err instanceof Error ? err.message : "Erro ao enviar e-mail"
           return Response.json({error: message}, {status: 500})
       }
}
