'use client'
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import "react-quill-new/dist/quill.snow.css"; // Estilos do Quill

// Importação dinâmica para evitar problemas no SSR (erro de não conseguir encontrar o document.)

const modules = { // Quill editor
    toolbar: [
      [{ size: [] }],
    //  [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      
   //   [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
   //   [{ list: "ordered" }, { list: "bullet" }],
   //   ["link", "image"],
   //  [{ color: ["red", "#785412"] }],
    //  [{ background: ["red", "#785412"] }]
    ]
  };

  const formats = [ //Quill editor
   // "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
  // "list",
  //  "bullet",
  // "link",
  //  "color",
  //  "image",
  //  "background",
    "align",
    "size",
  // "font"
  ];

  interface QuillEditorProps{
    setDirty: React.Dispatch<React.SetStateAction<string | undefined>> | any;
    onChange: React.Dispatch<React.SetStateAction<string | undefined>> | any;
    value: string;
    dirty: boolean;
    placeholder: string;
    /** id do <label> que descreve o editor (acessibilidade). */
    labelledBy?: string;
    /** Bloqueia a edição (ex.: tempo de prova encerrado). */
    readOnly?: boolean;
    /** Quando informado, colar e arrastar texto ficam bloqueados e esta função é chamada a cada tentativa. */
    onPasteBlocked?: () => void;
  }

export function QuillEditor({ value, onChange, dirty, setDirty, placeholder, labelledBy, readOnly, onPasteBlocked }: QuillEditorProps) {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }),[]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // O Quill monta a área editável (.ql-editor) depois do carregamento dinâmico;
  // aqui ligamos o rótulo visível a ela para leitores de tela.
  useEffect(() => {
    if (!labelledBy || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const apply = () => {
      const editor = wrapper.querySelector<HTMLElement>(".ql-editor");
      if (!editor) return false;
      editor.setAttribute("aria-labelledby", labelledBy);
      editor.setAttribute("aria-multiline", "true");
      return true;
    };
    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(wrapper, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [labelledBy]);

  // Prova online: impede colar/arrastar texto pronto para dentro do editor.
  const pasteRef = useRef(onPasteBlocked);
  pasteRef.current = onPasteBlocked;
  const blockPaste = Boolean(onPasteBlocked);
  useEffect(() => {
    if (!blockPaste || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const stop = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      pasteRef.current?.();
    };
    wrapper.addEventListener("paste", stop, true);
    wrapper.addEventListener("drop", stop, true);
    return () => {
      wrapper.removeEventListener("paste", stop, true);
      wrapper.removeEventListener("drop", stop, true);
    };
  }, [blockPaste]);

    return (
      <div ref={wrapperRef} role="group" aria-labelledby={labelledBy}>
        <ReactQuill
        onKeyDown={() => {if(dirty === false){setDirty(true)}}}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      </div>
    );
  }
