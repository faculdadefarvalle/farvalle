"use client";

import InputMask from "@mona-health/react-input-mask";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuChartColumn,
  LuCheck,
  LuCircleAlert,
  LuClipboardX,
  LuLock,
  LuPlay,
  LuTimer,
  LuClipboardCheck,
  LuClock3,
  LuFileText,
  LuGraduationCap,
  LuHouse,
  LuIdCard,
  LuInfo,
  LuMail,
  LuMapPin,
  LuMessageCircle,
  LuPencilLine,
  LuRefreshCw,
} from "react-icons/lu";
import { QuillEditor } from "../QuillEditor";
import { Icon, COURSE_ICON } from "../Icon";
import { COURSE_LIST, VESTIBULAR_EDITION, WHATSAPP_DISPLAY, WHATSAPP_URL } from "../../lib/site-content";
import {
  PROVA,
  contarPalavras,
  formatarTempo,
  sortearTema,
  temaPorId,
  textoDaRedacao,
} from "../../lib/vestibular-online";
import { trackEvent } from "../../lib/analytics";
import form from "../Form/form.module.scss";
import styles from "./style.module.scss";
import "react-quill-new/dist/quill.snow.css";

/* ===== Opções — exatamente os mesmos valores que o formulário anterior enviava ===== */
const CONHECEU = ["Facebook", "Instagram", "Google", "Whatsapp", "Panfleto", "Site", "Amigo", "Outros"];

const INGRESSO = [
  { value: "Vestibular Online", label: "Vestibular Online", hint: "Prova de redação online", icon: LuFileText },
  { value: "Nota do ENEM", label: "Nota do ENEM", hint: "Utilize sua nota do ENEM", icon: LuChartColumn },
  { value: "Transferência Externa", label: "Transferência Externa", hint: "Para quem já estuda em outra instituição", icon: LuRefreshCw },
  { value: "Segunda Graduação", label: "Segunda Graduação", hint: "Para quem já tem um diploma", icon: LuGraduationCap },
];

const STEPS = [
  { id: 1, label: "Dados pessoais", hint: "Seus dados básicos" },
  { id: 2, label: "Curso e ingresso", hint: "Escolha seu curso" },
  { id: 3, label: "Redação", hint: "Prova online" },
  { id: 4, label: "Confirmação", hint: "Revise e finalize" },
];

const DOCUMENTS = [
  { icon: LuIdCard, text: "Documento de identificação (RG ou CNH)" },
  { icon: LuIdCard, text: "CPF" },
  { icon: LuHouse, text: "Comprovante de residência (atualizado)" },
  { icon: LuFileText, text: "Histórico do Ensino Médio (ou declaração de conclusão)" },
];

const EMAIL = process.env.NEXT_PUBLIC_FARVALLE_MAIL || "";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type FormState = {
  nome: string;
  tel: string;
  email: string;
  city: string;
  conheceu: string;
  course: string;
  ingresso: string;
};

const initialState: FormState = {
  nome: "",
  tel: "",
  email: "",
  city: "",
  conheceu: "",
  course: "",
  ingresso: "",
};

type FieldErrors = Partial<Record<keyof FormState | "redacao", string>>;

/** Prova de redação em andamento (fica salva no navegador até o envio). */
type ProvaState = {
  temaId: string;
  /** Início da prova (ms). */
  inicio: number;
  /** Tentativas de colar ou arrastar texto (bloqueadas). */
  colagens: number;
};

type Rascunho = {
  data: FormState;
  redacao: string;
  prova: ProvaState;
  step: number;
  salvoEm: number;
};

const DURACAO_MS = PROVA.duracaoMin * 60 * 1000;

function lerRascunho(): Rascunho | null {
  try {
    const raw = window.localStorage.getItem(PROVA.storageKey);
    if (!raw) return null;
    const salvo = JSON.parse(raw) as Rascunho;
    const validade = PROVA.validadeRascunhoH * 3600 * 1000;
    if (!salvo?.prova?.inicio || Date.now() - salvo.prova.inicio > validade || !temaPorId(salvo.prova.temaId)) {
      window.localStorage.removeItem(PROVA.storageKey);
      return null;
    }
    return salvo;
  } catch {
    return null;
  }
}

function apagarRascunho() {
  try {
    window.localStorage.removeItem(PROVA.storageKey);
  } catch {
    /* navegador sem armazenamento: nada a apagar */
  }
}

export function InscricaoForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initialState);
  const [redacao, setRedacao] = useState("");
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [prova, setProva] = useState<ProvaState | null>(null);
  const [agora, setAgora] = useState(() => Date.now());
  const [avisoColagem, setAvisoColagem] = useState(false);
  const [restaurado, setRestaurado] = useState(false);
  const [pronto, setPronto] = useState(false);

  const needsEssay = data.ingresso === "Vestibular Online";
  const essayText = useMemo(() => textoDaRedacao(redacao), [redacao]);
  const palavras = useMemo(() => contarPalavras(essayText), [essayText]);
  const tema = temaPorId(prova?.temaId);
  const restanteMs = prova ? Math.max(0, prova.inicio + DURACAO_MS - agora) : DURACAO_MS;
  const encerrada = Boolean(prova) && restanteMs <= 0;
  const reta = Boolean(prova) && !encerrada && restanteMs <= 5 * 60 * 1000;

  // Recupera uma prova em andamento (ex.: página recarregada). O relógio não para.
  useEffect(() => {
    const salvo = lerRascunho();
    if (salvo) {
      setData({ ...initialState, ...salvo.data });
      setRedacao(salvo.redacao || "");
      setProva(salvo.prova);
      setStep(salvo.step === 4 ? 4 : 3);
      setRestaurado(true);
    }
    setPronto(true);
  }, []);

  // Salva automaticamente enquanto a prova estiver em andamento.
  useEffect(() => {
    if (!pronto || !prova) return;
    try {
      const rascunho: Rascunho = { data, redacao, prova, step, salvoEm: Date.now() };
      window.localStorage.setItem(PROVA.storageKey, JSON.stringify(rascunho));
    } catch {
      /* sem armazenamento local: a prova segue normalmente nesta aba */
    }
  }, [pronto, prova, data, redacao, step]);

  // Relógio da prova.
  useEffect(() => {
    if (!prova || encerrada) return;
    setAgora(Date.now());
    const id = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [prova, encerrada]);

  // Aviso ao fechar a aba no meio da prova.
  useEffect(() => {
    if (!prova || loading) return;
    const avisar = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [prova, loading]);

  const registrarColagem = useCallback(() => {
    setProva((atual) => (atual ? { ...atual, colagens: atual.colagens + 1 } : atual));
    setAvisoColagem(true);
  }, []);

  function iniciarProva() {
    const sorteado = sortearTema();
    const inicio = Date.now();
    setAgora(inicio);
    setRedacao("");
    setProva({ temaId: sorteado.id, inicio, colagens: 0 });
    setErrors((current) => ({ ...current, redacao: undefined }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const update = (field: keyof FormState, value: string) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function validateStep(current: number): boolean {
    const next: FieldErrors = {};
    if (current === 1) {
      if (data.nome.trim().length < 3) next.nome = "Informe seu nome completo.";
      if (data.tel.replace(/\D/g, "").length < 10) next.tel = "Informe um telefone válido com DDD.";
      if (!emailRegex.test(data.email)) next.email = "Insira um e-mail válido.";
      if (!data.city.trim()) next.city = "Informe sua cidade.";
      if (!data.conheceu) next.conheceu = "Escolha uma opção.";
    }
    if (current === 2) {
      if (!data.course) next.course = "Escolha o curso pretendido.";
      if (!data.ingresso) next.ingresso = "Escolha a forma de ingresso.";
    }
    if (current === 3 && needsEssay) {
      if (!prova) {
        next.redacao = "Clique em “Iniciar prova” para receber seu tema.";
      } else if (palavras === 0) {
        next.redacao = "Sua redação está em branco.";
      } else if (!encerrada && palavras < PROVA.minPalavras) {
        next.redacao = `Sua redação precisa ter pelo menos ${PROVA.minPalavras} palavras (agora: ${palavras}).`;
      } else if (!encerrada && palavras > PROVA.maxPalavras) {
        next.redacao = `Sua redação passou do limite de ${PROVA.maxPalavras} palavras (agora: ${palavras}).`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Telas: 1 = Dados pessoais + Curso e ingresso (juntos, como no layout), 3 = Redação, 4 = Confirmação
  function goNext() {
    if (step === 1) {
      if (!validateBoth()) return;
      setStep(needsEssay ? 3 : 4);
    } else if (step === 3) {
      if (needsEssay && !prova) {
        iniciarProva();
        return;
      }
      if (!validateStep(3)) return;
      setStep(4);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Valida as seções 1 e 2 de uma vez (ficam na mesma tela). */
  function validateBoth(): boolean {
    const next: FieldErrors = {};
    if (data.nome.trim().length < 3) next.nome = "Informe seu nome completo.";
    if (data.tel.replace(/\D/g, "").length < 10) next.tel = "Informe um telefone válido com DDD.";
    if (!emailRegex.test(data.email)) next.email = "Insira um e-mail válido.";
    if (!data.city.trim()) next.city = "Informe sua cidade.";
    if (!data.conheceu) next.conheceu = "Escolha uma opção.";
    if (!data.course) next.course = "Escolha o curso pretendido.";
    if (!data.ingresso) next.ingresso = "Escolha a forma de ingresso.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goBack() {
    if (step === 4) {
      setStep(needsEssay ? 3 : 1);
      return;
    }
    setStep(1);
  }

  async function handleSubmit() {
    setSubmitError("");
    if (!validateBoth()) {
      setStep(1);
      return;
    }
    if (needsEssay && !validateStep(3)) {
      setStep(3);
      return;
    }

    setLoading(true);
    const fim = prova ? Math.min(Date.now(), prova.inicio + DURACAO_MS) : 0;
    try {
      // Mesmas chamadas e mesmo contrato do formulário anterior
      const dadosProva =
        needsEssay && prova && tema
          ? {
              tema: tema.titulo,
              inicio: prova.inicio,
              fim,
              duracaoMin: PROVA.duracaoMin,
              palavras,
              colagens: prova.colagens,
              encerradaPorTempo: fim - prova.inicio >= DURACAO_MS,
            }
          : null;

      await axios.post("/api/inscricao", {
        nome: data.nome,
        city: data.city,
        conheceu: data.conheceu,
        course: data.course,
        email: data.email,
        ingresso: data.ingresso,
        tel: data.tel,
        ...(dadosProva ? { redacao, prova: dadosProva } : {}),
      });

      await axios.post("/api/inscricao/email", {
        nome: data.nome,
        city: data.city,
        conheceu: data.conheceu,
        course: data.course,
        email: data.email,
        ingresso: data.ingresso,
        tel: data.tel,
        text: needsEssay ? redacao : "<p> </p>",
        ...(dadosProva ? { prova: dadosProva } : {}),
      });

      apagarRascunho();
      trackEvent("generate_lead", { method: "inscricao", ingresso: data.ingresso, curso: data.course });
      router.push("/inscricao-enviada");
    } catch {
      setSubmitError(
        "Não foi possível concluir a inscrição. Verifique sua conexão e tente novamente, ou fale com a gente pelo WhatsApp."
      );
      setLoading(false);
    }
  }

  const visibleSteps = STEPS.filter((item) => item.id !== 3 || needsEssay || !data.ingresso);
  const courseName = COURSE_LIST.find((course) => course.name === data.course)?.name;

  return (
    <div className={styles.layout}>
      {/* Indicador de etapas */}
      <ol className={`fv-card ${styles.stepper}`} aria-label="Etapas da inscrição">
        {visibleSteps.map((item, index) => {
          const active = step === 1 ? item.id <= 2 : item.id === step;
          const state = active ? "current" : item.id < step ? "done" : "todo";
          return (
            <li key={item.id} className={`${styles.step} ${styles[state]}`} aria-current={state === "current" ? "step" : undefined}>
              <span className={styles.stepNumber}>{state === "done" ? <LuCheck size={16} aria-hidden="true" /> : index + 1}</span>
              <span className={styles.stepText}>
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
            </li>
          );
        })}
      </ol>

      <div className={styles.grid}>
        <section className={`fv-card ${styles.panel}`} aria-live="polite">
          {step === 1 && (
            <>
              <header className={styles.panelHead}>
                <h2>
                  <span>1.</span> Dados pessoais
                </h2>
                <p>Preencha seus dados para iniciar sua inscrição no {VESTIBULAR_EDITION} da Farvalle.</p>
                <span className={form.hint}>Campos obrigatórios *</span>
              </header>

              <div className={form.field}>
                <label htmlFor="nome" className={form.required}>
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  className={form.input}
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                  value={data.nome}
                  aria-invalid={!!errors.nome}
                  onChange={(e) => update("nome", e.target.value)}
                />
                {errors.nome && <span className={form.error}>{errors.nome}</span>}
              </div>

              <div className={form.row}>
                <div className={form.field}>
                  <label htmlFor="email" className={form.required}>
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={form.input}
                    placeholder="exemplo@seuemail.com"
                    autoComplete="email"
                    value={data.email}
                    aria-invalid={!!errors.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  {errors.email && <span className={form.error}>{errors.email}</span>}
                </div>
                <div className={form.field}>
                  <label htmlFor="tel" className={form.required}>
                    Telefone / WhatsApp
                  </label>
                  <InputMask mask="(99) 99999-9999" placeholder="(00) 00000-0000" value={data.tel} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("tel", e.target.value)}>
                    <input id="tel" name="tel" type="tel" className={form.input} autoComplete="tel" aria-invalid={!!errors.tel} />
                  </InputMask>
                  {errors.tel && <span className={form.error}>{errors.tel}</span>}
                </div>
              </div>

              <div className={form.row}>
                <div className={form.field}>
                  <label htmlFor="city" className={form.required}>
                    Cidade
                  </label>
                  <input
                    id="city"
                    name="city"
                    className={form.input}
                    placeholder="Digite sua cidade"
                    autoComplete="address-level2"
                    value={data.city}
                    aria-invalid={!!errors.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                  {errors.city && <span className={form.error}>{errors.city}</span>}
                </div>
                <div className={form.field}>
                  <label htmlFor="conheceu" className={form.required}>
                    Como conheceu a Farvalle?
                  </label>
                  <select
                    id="conheceu"
                    name="conheceu"
                    className={form.select}
                    value={data.conheceu}
                    aria-invalid={!!errors.conheceu}
                    onChange={(e) => update("conheceu", e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {CONHECEU.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.conheceu && <span className={form.error}>{errors.conheceu}</span>}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <hr className={styles.divider} />
              <header className={styles.panelHead}>
                <h2>
                  <span>2.</span> Curso e forma de ingresso
                </h2>
                <p>Escolha o curso em que deseja se inscrever e a forma de ingresso no {VESTIBULAR_EDITION}.</p>
              </header>

              <fieldset className={styles.fieldset}>
                <legend className={form.required}>Curso pretendido</legend>
                <div className={form.choices}>
                  {COURSE_LIST.map((course) => (
                    <label key={course.uid} className={`${form.choice} ${data.course === course.name ? form.choiceSelected : ""}`}>
                      <input
                        type="radio"
                        name="course"
                        value={course.name}
                        checked={data.course === course.name}
                        onChange={() => update("course", course.name)}
                      />
                      <Icon name={COURSE_ICON[course.uid]} size={34} className={form.choiceIcon} />
                      <strong>{course.name}</strong>
                      <small>{course.tagline}</small>
                    </label>
                  ))}
                </div>
                {errors.course && <span className={form.error}>{errors.course}</span>}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend className={form.required}>Forma de ingresso</legend>
                <div className={`${form.choices} ${styles.choicesFour}`}>
                  {INGRESSO.map((option) => (
                    <label
                      key={option.value}
                      className={`${form.choice} ${form.choiceRow} ${data.ingresso === option.value ? form.choiceSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name="ingresso"
                        value={option.value}
                        checked={data.ingresso === option.value}
                        onChange={() => update("ingresso", option.value)}
                      />
                      <option.icon size={34} className={form.choiceIcon} aria-hidden="true" />
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.hint}</small>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.ingresso && <span className={form.error}>{errors.ingresso}</span>}
              </fieldset>
            </>
          )}

          {step === 3 && needsEssay && (
            <>
              <header className={styles.panelHead}>
                <h2>
                  <span>3.</span> Redação
                </h2>
                <p>
                  {prova
                    ? "Leia com atenção o tema sorteado e escreva seu texto no campo abaixo."
                    : "A prova do vestibular online é uma redação feita aqui mesmo, no site."}
                </p>
              </header>

              {!prova && (
                <div className={styles.examIntro}>
                  <ul className={styles.examFacts}>
                    <li>
                      <LuTimer size={22} aria-hidden="true" />
                      <span>
                        <strong>{PROVA.duracaoMin} minutos</strong>
                        <small>O tempo começa ao clicar em “Iniciar prova” e não para, nem se a página for fechada.</small>
                      </span>
                    </li>
                    <li>
                      <LuFileText size={22} aria-hidden="true" />
                      <span>
                        <strong>Tema sorteado</strong>
                        <small>Você recebe um tema na hora, com textos de apoio.</small>
                      </span>
                    </li>
                    <li>
                      <LuPencilLine size={22} aria-hidden="true" />
                      <span>
                        <strong>
                          {PROVA.minPalavras} a {PROVA.maxPalavras} palavras
                        </strong>
                        <small>Texto dissertativo-argumentativo, em prosa.</small>
                      </span>
                    </li>
                    <li>
                      <LuClipboardX size={22} aria-hidden="true" />
                      <span>
                        <strong>Sem copiar e colar</strong>
                        <small>Escreva com suas palavras. Colar texto fica bloqueado.</small>
                      </span>
                    </li>
                  </ul>

                  <div className={styles.essayRules}>
                    <strong>Antes de começar</strong>
                    <ol>
                      <li>Escolha um lugar tranquilo e tenha tempo livre: a prova é feita de uma vez só.</li>
                      <li>Seu texto é salvo automaticamente neste navegador enquanto você escreve.</li>
                      <li>Quando o tempo acabar, o editor é travado e você só precisa conferir e enviar.</li>
                      <li>Será ANULADA a redação escrita fora do tema ou em forma de verso.</li>
                    </ol>
                  </div>

                  <button type="button" className={`fv-btn fv-btn--primary ${styles.examStart}`} onClick={iniciarProva}>
                    <LuPlay size={16} aria-hidden="true" /> Iniciar prova
                  </button>
                </div>
              )}

              {prova && tema && (
                <>
                  <div
                    className={`${styles.examBar} ${reta ? styles.examBarWarn : ""} ${encerrada ? styles.examBarEnd : ""}`}
                    role="timer"
                    aria-live="off"
                  >
                    <span className={styles.examClock}>
                      {encerrada ? <LuLock size={18} aria-hidden="true" /> : <LuTimer size={18} aria-hidden="true" />}
                      <span>
                        <small>{encerrada ? "Tempo encerrado" : "Tempo restante"}</small>
                        <strong>{formatarTempo(restanteMs)}</strong>
                      </span>
                    </span>
                    <span
                      className={`${styles.examWords} ${
                        palavras > PROVA.maxPalavras ? styles.examWordsOver : palavras >= PROVA.minPalavras ? styles.examWordsOk : ""
                      }`}
                    >
                      <small>Palavras</small>
                      <strong>
                        {palavras} <em>de {PROVA.minPalavras} a {PROVA.maxPalavras}</em>
                      </strong>
                    </span>
                  </div>

                  {restaurado && !encerrada && (
                    <div className={`${form.alert} ${form.alertSuccess}`}>
                      <LuCheck size={18} aria-hidden="true" />
                      <span>Recuperamos sua prova de onde você parou. O tempo continuou correndo.</span>
                    </div>
                  )}

                  {encerrada && (
                    <div className={`${form.alert} ${form.alertInfo}`} role="status">
                      <LuLock size={18} aria-hidden="true" />
                      <span>O tempo acabou e sua redação foi guardada. Agora é só avançar e finalizar a inscrição.</span>
                    </div>
                  )}

                  <div className={styles.essayTheme}>
                    <div className={styles.essayRules}>
                      <strong>Instruções</strong>
                      <p>Será ANULADA a redação que:</p>
                      <ol>
                        <li>For redigida fora do tema proposto;</li>
                        <li>For apresentada em forma de verso.</li>
                      </ol>
                    </div>
                    <div className={styles.essayText}>
                      <span className="fv-eyebrow">Tema</span>
                      <h3>{tema.titulo}</h3>
                      {tema.textos.map((paragrafo) => (
                        <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
                      ))}
                    </div>
                  </div>

                  <div className={form.field}>
                    <label id="redacao-label" className={form.required}>
                      Sua redação
                    </label>
                    <div className={`${styles.editor} ${encerrada ? styles.editorLocked : ""}`}>
                      <QuillEditor
                        value={redacao}
                        onChange={(value: string) => {
                          if (!encerrada) setRedacao(value);
                        }}
                        dirty={dirty}
                        setDirty={setDirty}
                        placeholder="Digite sua redação aqui..."
                        labelledBy="redacao-label"
                        readOnly={encerrada}
                        onPasteBlocked={registrarColagem}
                      />
                    </div>
                    {avisoColagem && !encerrada && (
                      <span className={form.hint} role="status">
                        Colar texto não é permitido na prova. Continue escrevendo com suas palavras.
                      </span>
                    )}
                    {errors.redacao && <span className={form.error}>{errors.redacao}</span>}
                  </div>
                </>
              )}

              {!prova && errors.redacao && <span className={form.error}>{errors.redacao}</span>}
            </>
          )}

          {step === 4 && (
            <>
              <header className={styles.panelHead}>
                <h2>
                  <span>{needsEssay ? "4." : "3."}</span> Confirmação
                </h2>
                <p>Revise suas informações antes de finalizar a inscrição.</p>
              </header>

              <dl className={styles.review}>
                <div>
                  <dt>Nome completo</dt>
                  <dd>{data.nome}</dd>
                </div>
                <div>
                  <dt>E-mail</dt>
                  <dd>{data.email}</dd>
                </div>
                <div>
                  <dt>Telefone / WhatsApp</dt>
                  <dd>{data.tel}</dd>
                </div>
                <div>
                  <dt>Cidade</dt>
                  <dd>{data.city}</dd>
                </div>
                <div>
                  <dt>Como conheceu a Farvalle</dt>
                  <dd>{data.conheceu}</dd>
                </div>
                <div>
                  <dt>Curso pretendido</dt>
                  <dd>{data.course}</dd>
                </div>
                <div>
                  <dt>Forma de ingresso</dt>
                  <dd>{data.ingresso}</dd>
                </div>
                {needsEssay && (
                  <div className={styles.reviewWide}>
                    <dt>Redação{tema ? ` · ${tema.titulo}` : ""}</dt>
                    <dd>{essayText.length > 220 ? `${essayText.slice(0, 220)}...` : essayText}</dd>
                    <dd className={styles.reviewMeta}>
                      {palavras} palavras
                      {prova && !encerrada ? ` · ${formatarTempo(restanteMs)} restantes para revisar` : ""}
                    </dd>
                  </div>
                )}
              </dl>

              <div className={`${form.alert} ${form.alertInfo}`}>
                <LuInfo size={18} aria-hidden="true" />
                <span>
                  Ao finalizar, seus dados serão enviados à secretaria acadêmica da Farvalle, que entrará em contato pelo
                  e-mail ou WhatsApp informados.
                </span>
              </div>

              {submitError && (
                <div className={`${form.alert} ${form.alertError}`} role="alert">
                  <LuCircleAlert size={18} aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}
            </>
          )}

          <footer className={styles.panelFoot}>
            {step > 1 ? (
              <button type="button" className="fv-btn fv-btn--outline-green" onClick={goBack} disabled={loading}>
                <LuArrowLeft size={16} aria-hidden="true" /> Voltar
              </button>
            ) : (
              <Link href="/" className={styles.cancel}>
                Cancelar inscrição
              </Link>
            )}

            {step === 3 && needsEssay && !prova ? null : step < 4 ? (
              <button type="button" className="fv-btn fv-btn--primary" onClick={goNext}>
                {step === 3 && needsEssay ? "Entregar redação" : "Avançar inscrição"}{" "}
                <LuArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="fv-btn fv-btn--primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Enviando..." : "Finalizar inscrição"} <LuClipboardCheck size={16} aria-hidden="true" />
              </button>
            )}
          </footer>
        </section>

        {/* Lateral */}
        <aside className={styles.aside}>
          <div className={`fv-card ${styles.summary}`}>
            <h3>Resumo da inscrição</h3>
            <p>Acompanhe suas informações.</p>
            <ul>
              <li>
                <span className="fv-icon-circle">
                  <LuGraduationCap size={20} aria-hidden="true" />
                </span>
                <span>
                  <small>Curso selecionado</small>
                  <strong>{courseName || "A definir"}</strong>
                </span>
              </li>
              <li>
                <span className="fv-icon-circle">
                  <LuPencilLine size={20} aria-hidden="true" />
                </span>
                <span>
                  <small>Forma de ingresso</small>
                  <strong>{data.ingresso || "A definir"}</strong>
                </span>
              </li>
              <li>
                <span className="fv-icon-circle">
                  <LuMapPin size={20} aria-hidden="true" />
                </span>
                <span>
                  <small>Cidade</small>
                  <strong>{data.city || "Não informado"}</strong>
                </span>
              </li>
              <li>
                <span className="fv-icon-circle">
                  <LuCalendarDays size={20} aria-hidden="true" />
                </span>
                <span>
                  <small>Ingresso</small>
                  <strong>{VESTIBULAR_EDITION}</strong>
                </span>
              </li>
            </ul>
          </div>

          <div className={`fv-card ${styles.docs}`}>
            <h3>Documentos e orientações</h3>
            <p>Tenha em mãos as informações e documentos que podem ser solicitados durante o processo.</p>
            <ul>
              {DOCUMENTS.map((doc) => (
                <li key={doc.text}>
                  <doc.icon size={18} aria-hidden="true" />
                  {doc.text}
                </li>
              ))}
            </ul>
            <div className={`${form.alert} ${form.alertInfo}`}>
              <LuInfo size={16} aria-hidden="true" />
              <span>A documentação completa será solicitada após a confirmação da inscrição.</span>
            </div>
          </div>

          <div className={`fv-card ${styles.help}`}>
            <h3>Precisa de ajuda?</h3>
            <p>Nossa equipe está pronta para te atender.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.helpWhats}>
              <LuMessageCircle size={20} aria-hidden="true" />
              <span>
                <small>Fale com a gente pelo WhatsApp</small>
                <strong>{WHATSAPP_DISPLAY}</strong>
              </span>
            </a>
            {EMAIL && (
              <a href={`mailto:${EMAIL}`} className={styles.helpItem}>
                <LuMail size={18} aria-hidden="true" />
                <span>
                  <small>Ou envie um e-mail</small>
                  <strong>{EMAIL}</strong>
                </span>
              </a>
            )}
            <div className={styles.helpItem}>
              <LuClock3 size={18} aria-hidden="true" />
              <span>
                <small>Horário de atendimento</small>
                <strong>Segunda a sexta, horário comercial</strong>
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
