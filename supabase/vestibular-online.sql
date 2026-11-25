-- Vestibular online: guarda a redação e os dados da prova junto com a inscrição.
-- Rodar uma vez no SQL Editor do Supabase (projeto da Farvalle). Pode rodar de novo sem problema.
alter table public.inscricoes
  add column if not exists redacao_tema text,
  add column if not exists redacao_texto text,
  add column if not exists redacao_inicio timestamptz,
  add column if not exists redacao_entrega timestamptz,
  add column if not exists redacao_palavras integer,
  add column if not exists redacao_colagens integer,
  add column if not exists redacao_resultado text default 'aguardando';

comment on column public.inscricoes.redacao_resultado is 'aguardando | aprovado | reprovado (preenchido pela coordenação)';
