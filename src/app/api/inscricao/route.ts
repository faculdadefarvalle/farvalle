import { supabase } from "../../services/supabase";
import { sanitizeRichText } from "../../services/mail-utils";

type DadosProva = {
    tema?: unknown;
    inicio?: unknown;
    fim?: unknown;
    palavras?: unknown;
    colagens?: unknown;
};

const numero = (valor: unknown) => (typeof valor === "number" && Number.isFinite(valor) ? valor : null);
const dataIso = (valor: unknown) => {
    const ms = numero(valor);
    return ms ? new Date(ms).toISOString() : null;
};

/** Coluna que ainda não existe na tabela (antes de rodar supabase/vestibular-online.sql). */
function colunaInexistente(error: { code?: string; message?: string } | null) {
    if (!error) return false;
    return error.code === "PGRST204" || error.code === "42703" || /column/i.test(error.message ?? "");
}

export async function POST(req: Request){

    const {nome, city, conheceu, course, email, ingresso, tel, redacao, prova: provaRaw} = await req.json()

    // Mesmos campos de sempre
    const base = {
        nome: nome,
        cidade: city,
        conheceu: conheceu,
        curso: course,
        email: email,
        ingresso: ingresso,
        telefone: tel
    };

    // Vestibular online: redação e dados da prova (opcionais)
    const prova: DadosProva | null = provaRaw && typeof provaRaw === "object" ? provaRaw : null;
    const extras = prova
        ? {
              redacao_tema: typeof prova.tema === "string" ? prova.tema.slice(0, 300) : null,
              redacao_texto: typeof redacao === "string" ? sanitizeRichText(redacao).slice(0, 60000) : null,
              redacao_inicio: dataIso(prova.inicio),
              redacao_entrega: dataIso(prova.fim),
              redacao_palavras: numero(prova.palavras),
              redacao_colagens: numero(prova.colagens),
          }
        : null;

    try{
        let { error } = await supabase
            .from("inscricoes")
            .insert(extras ? { ...base, ...extras } : base);

        // Se as colunas da redação ainda não foram criadas, grava a inscrição como antes
        // (a redação continua indo completa no e-mail para a secretaria).
        if (error && extras && colunaInexistente(error)) {
            ({ error } = await supabase.from("inscricoes").insert(base));
        }

        if (error) {
            throw error;
        }

        return Response.json({success: true}, {status: 200})
    } catch(e){
        return Response.json({error: e}, {status: 400})
    }
}
