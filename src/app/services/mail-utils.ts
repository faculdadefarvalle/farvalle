// Utilidades para montar e-mails com conteúdo digitado pelo visitante.

// Campos de texto entram no HTML do e-mail como texto (evita HTML injetado).
export function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Texto do editor (Quill): só passam as marcações dele; o resto é removido.
const TAGS_PERMITIDAS = new Set(["p", "br", "strong", "b", "em", "i", "u", "s", "blockquote", "span"]);
export function sanitizeRichText(html: string) {
    return html
        .replace(/<(script|style|iframe|object|embed|svg|math|template)[\s\S]*?<\/\1\s*>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tagInteira, nomeTag: string, atributos: string) => {
            const tag = nomeTag.toLowerCase();
            if (!TAGS_PERMITIDAS.has(tag)) return "";
            if (tagInteira.startsWith("</")) return `</${tag}>`;
            const classe = /class\s*=\s*"([^"]*)"/i.exec(atributos)?.[1] ?? "";
            const seguras = classe.split(/\s+/).filter((c) => /^ql-(align|size)-[a-z]+$/.test(c)).join(" ");
            return seguras ? `<${tag} class="${seguras}">` : `<${tag}>`;
        });
}

export function stripHtml(html: string) {
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

/** Lista de e-mails a partir de uma variável de ambiente ("a@x.com, b@y.com"). */
export function emailsDaVariavel(valor: string | undefined): string[] {
    return (valor ?? "")
        .split(/[,;\s]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}
