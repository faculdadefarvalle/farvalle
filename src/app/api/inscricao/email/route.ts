import { sendResendMail } from "../../../services/resend";
import { escapeHtml, sanitizeRichText, stripHtml } from "../../../services/mail-utils";
import juice from "juice";
import "react-quill-new/dist/quill.snow.css"

// Destino oficial das inscrições (secretaria acadêmica). Pode ser sobrescrito por INSCRICAO_TO na Vercel.
const INSCRICAO_TO_PADRAO = "secad@farvalle.edu.br";


type DadosProva = {
    tema?: unknown
    inicio?: unknown
    fim?: unknown
    duracaoMin?: unknown
    palavras?: unknown
    colagens?: unknown
    encerradaPorTempo?: unknown
}

const numero = (valor: unknown) => (typeof valor === "number" && Number.isFinite(valor) ? valor : 0)

function dataHora(ms: number) {
    if (!ms) return "—"
    return new Date(ms).toLocaleString("pt-BR", { timeZone: "America/Bahia", dateStyle: "short", timeStyle: "medium" })
}

function duracao(ms: number) {
    const total = Math.max(0, Math.round(ms / 1000))
    const min = Math.floor(total / 60)
    const seg = total % 60
    return `${min} min ${String(seg).padStart(2, "0")} s`
}

export async function POST(request: Request) {

    const {nome: nomeRaw, email, tel: telRaw, text, course: courseRaw, city: cityRaw, ingresso: ingressoRaw, conheceu: conheceuRaw, prova: provaRaw, gravadaNoBanco} = await request.json()

    const nome = escapeHtml(nomeRaw)
    const tel = escapeHtml(telRaw)
    const emailHtml = escapeHtml(email)
    const course = escapeHtml(courseRaw)
    const city = escapeHtml(cityRaw)
    const ingresso = escapeHtml(ingressoRaw)
    const conheceu = escapeHtml(conheceuRaw)

    const inscricaoTo = process.env.INSCRICAO_TO || INSCRICAO_TO_PADRAO
    const redacao = typeof text === "string" && text.trim() ? sanitizeRichText(text) : "<p> </p>"
    const htmlInline = juice(redacao)

    // Dados da prova do vestibular online (só quando o candidato fez a redação no site)
    const prova: DadosProva | null = provaRaw && typeof provaRaw === "object" ? provaRaw : null
    const inicio = numero(prova?.inicio)
    const fim = numero(prova?.fim)
    const linhasProva = prova
        ? [
              ["Tema sorteado", String(prova.tema ?? "")],
              ["Início da prova", dataHora(inicio)],
              ["Entrega", dataHora(fim)],
              ["Tempo usado", `${duracao(fim - inicio)} de ${numero(prova.duracaoMin)} min${prova.encerradaPorTempo ? " (tempo esgotado)" : ""}`],
              ["Palavras", String(numero(prova.palavras))],
              ["Tentativas de colar texto (bloqueadas)", String(numero(prova.colagens))],
          ]
        : []
    const blocoProva = linhasProva.length
        ? `<div style="margin-top: 18px; padding: 14px 16px; background: #fcf8f4; border-radius: 8px; text-align: left;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #e85824; font-weight: bold;">Vestibular online · aguardando avaliação</div>
            ${linhasProva.map(([rotulo, valor]) => `<div style="font-size: 15px; margin-top: 8px;"><strong>${escapeHtml(rotulo)}:</strong> ${escapeHtml(valor)}</div>`).join("")}
            <div style="font-size: 13px; margin-top: 12px; color: #8a3a1c;">Para aprovar ou reprovar, responda a este e-mail: a resposta vai direto para o candidato.</div>
           </div>`
        : ""

    // Aviso quando a cópia no banco de dados falhou (a inscrição vale pelo e-mail)
    const semBanco = gravadaNoBanco === false
    const avisoBanco = semBanco
        ? `<div style="margin-top: 18px; padding: 10px 14px; background: #fff4e5; border-radius: 8px; font-size: 13px; color: #8a5a00; text-align: left;">Esta inscrição não foi gravada no banco de dados do site (falha técnica). Guarde este e-mail: ele é o registro da inscrição.</div>`
        : ""

    const textoSimples = [
        "Nova Inscrição | FARVALLE",
        `Nome: ${nomeRaw ?? ""}`,
        `Celular / Whatsapp: ${telRaw ?? ""}`,
        `E-mail: ${email ?? ""}`,
        `Cidade: ${cityRaw ?? ""}`,
        `Como conheceu a FARVALLE: ${conheceuRaw ?? ""}`,
        `Forma de Ingresso: ${ingressoRaw ?? ""}`,
        `Curso desejado: ${courseRaw ?? ""}`,
        ...linhasProva.map(([rotulo, valor]) => `${rotulo}: ${valor}`),
        ...(semBanco ? ["", "Atenção: esta inscrição não foi gravada no banco de dados do site. Guarde este e-mail."] : []),
        "",
        "Redação:",
        stripHtml(redacao),
    ].join("\n")

    try {
        await sendResendMail({
           to: inscricaoTo,
           subject: prova ? `📝 Vestibular Online: redação de ${String(nomeRaw ?? "").replace(/\s+/g, " ").trim().slice(0, 80)} | FARVALLE` : '🗣️ Nova Inscrição | FARVALLE 🗣️',
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
            ${blocoProva}
            ${avisoBanco}
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
           ${prova ? `<p style="text-align: center; font-size: 15px;"><strong>Tema:</strong> ${escapeHtml(prova.tema)}</p>` : ""}

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
