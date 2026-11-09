/** Texto para busca, sem diferença de maiúsculas e acentos: "edicao" encontra "Edição". */
export function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}
