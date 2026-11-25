"use client";

import InputMask from "@mona-health/react-input-mask";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { LuCircleAlert, LuCircleCheck, LuClock3, LuMail, LuMapPin, LuMessageCircle, LuPhone, LuSend } from "react-icons/lu";
import { PageHero } from "../components/PageHero";
import { QuillEditor } from "../components/QuillEditor";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "../lib/site-content";
import form from "../components/Form/form.module.scss";
import styles from "./style.module.scss";
import "react-quill-new/dist/quill.snow.css";

const EMAIL = process.env.NEXT_PUBLIC_FARVALLE_MAIL || "";
const ADDRESS = "Avenida Dr. Luís Sande, 147, Santa Rita, Valle Shopping — Amargosa/BA, 45300-000";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Contato() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    const formElement = e.currentTarget;
    const data = Object.fromEntries(new FormData(formElement));

    const nome = String(data.nome || "").trim();
    const sobrenome = String(data.sobrenome || "").trim();
    const tel = String(data.tel || "").replace(/\D/g, "");
    const mensagem = code.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

    if (!nome || !sobrenome) {
      setStatus({ type: "error", message: "Informe seu nome e sobrenome." });
      return;
    }
    if (!emailRegex.test(String(data.email || ""))) {
      setStatus({ type: "error", message: "Insira um e-mail válido." });
      return;
    }
    if (tel.length < 10) {
      setStatus({ type: "error", message: "Informe um telefone válido com DDD." });
      return;
    }
    if (!mensagem) {
      setStatus({ type: "error", message: "Escreva sua mensagem antes de enviar." });
      return;
    }

    setLoading(true);
    try {
      // Mesma rota e mesmo contrato de antes: /api/contato
      await axios.post("/api/contato", {
        nome: data.nome,
        sobrenome: data.sobrenome,
        email: data.email,
        tel: data.tel,
        text: code,
      });
      setStatus({ type: "success", message: "Mensagem enviada! Nossa equipe vai responder em breve." });
      formElement.reset();
      setCode("");
      setDirty(false);
    } catch {
      setStatus({
        type: "error",
        message: "Não foi possível enviar sua mensagem. Verifique os dados ou fale com a gente pelo WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        crumbs={[{ label: "Contato" }]}
        eyebrow="Contato"
        title={
          <>
            Fale com <em>a Farvalle.</em>
          </>
        }
        text="Tem dúvidas, sugestões ou precisa de mais informações sobre nossos cursos? Nossa equipe está pronta para ajudar."
        compact
      />

      <section className={`fv-section ${styles.section}`}>
        <div className={`fv-container ${styles.grid}`}>
          <aside className={styles.info}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`fv-card ${styles.whats}`}>
              <LuMessageCircle size={28} aria-hidden="true" />
              <strong>Fale com a gente pelo WhatsApp</strong>
              <p>Atendimento rápido para dúvidas sobre cursos, vestibular e matrícula.</p>
              <span className="fv-btn fv-btn--light">{WHATSAPP_DISPLAY}</span>
            </a>

            <div className={`fv-card ${styles.infoCard}`}>
              <span className="fv-icon-circle">
                <LuPhone size={20} aria-hidden="true" />
              </span>
              <div>
                <strong>Telefone</strong>
                <a href="tel:+5575988708022">{WHATSAPP_DISPLAY}</a>
              </div>
            </div>

            {EMAIL && (
              <div className={`fv-card ${styles.infoCard}`}>
                <span className="fv-icon-circle">
                  <LuMail size={20} aria-hidden="true" />
                </span>
                <div>
                  <strong>E-mail</strong>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </div>
              </div>
            )}

            <div className={`fv-card ${styles.infoCard}`}>
              <span className="fv-icon-circle">
                <LuMapPin size={20} aria-hidden="true" />
              </span>
              <div>
                <strong>Endereço</strong>
                <span>{ADDRESS}</span>
              </div>
            </div>

            <div className={`fv-card ${styles.infoCard}`}>
              <span className="fv-icon-circle">
                <LuClock3 size={20} aria-hidden="true" />
              </span>
              <div>
                <strong>Horário de atendimento</strong>
                <span>Segunda a sexta-feira, em horário comercial.</span>
              </div>
            </div>
          </aside>

          <form className={`fv-card ${styles.form}`} onSubmit={handleSubmit} noValidate>
            <h2>Envie sua mensagem</h2>
            <p>Preencha o formulário e retornaremos o mais breve possível.</p>

            <div className={form.row}>
              <div className={form.field}>
                <label htmlFor="nome" className={form.required}>
                  Nome
                </label>
                <input className={form.input} type="text" id="nome" name="nome" required placeholder="Seu nome" autoComplete="given-name" />
              </div>
              <div className={form.field}>
                <label htmlFor="sobrenome" className={form.required}>
                  Sobrenome
                </label>
                <input className={form.input} type="text" id="sobrenome" name="sobrenome" required placeholder="Seu sobrenome" autoComplete="family-name" />
              </div>
            </div>

            <div className={form.row}>
              <div className={form.field}>
                <label htmlFor="email" className={form.required}>
                  E-mail
                </label>
                <input className={form.input} type="email" id="email" name="email" required placeholder="exemplo@seuemail.com" autoComplete="email" />
              </div>
              <div className={form.field}>
                <label htmlFor="tel" className={form.required}>
                  Celular / WhatsApp
                </label>
                <InputMask mask="(99) 99999-9999" placeholder="(00) 00000-0000">
                  <input className={form.input} required type="tel" name="tel" id="tel" autoComplete="tel" />
                </InputMask>
              </div>
            </div>

            <div className={form.field}>
              <label id="mensagem-label" className={form.required}>
                Mensagem
              </label>
              <div className={styles.editor}>
                <QuillEditor
                  value={code}
                  onChange={setCode}
                  dirty={dirty}
                  setDirty={setDirty}
                  placeholder="Digite sua mensagem..."
                  labelledBy="mensagem-label"
                />
              </div>
            </div>

            {status && (
              <div
                role="status"
                className={`${form.alert} ${status.type === "success" ? form.alertSuccess : form.alertError}`}
              >
                {status.type === "success" ? <LuCircleCheck size={18} aria-hidden="true" /> : <LuCircleAlert size={18} aria-hidden="true" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className={styles.actions}>
              <span className={form.hint}>Campos obrigatórios *</span>
              <button type="submit" disabled={!dirty || loading} className={`fv-btn fv-btn--primary ${styles.submit}`}>
                {loading ? "Enviando..." : "Enviar mensagem"} <LuSend size={16} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className={`fv-section ${styles.section}`} style={{ paddingTop: 0 }}>
        <div className="fv-container">
          <Link href="/matricular" className="fv-btn fv-btn--outline">
            Quero me inscrever no vestibular
          </Link>
        </div>
      </section>
    </>
  );
}
