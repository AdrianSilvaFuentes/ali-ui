/**
 * Primitivos: a matéria-prima visual da Ali UI (valores brutos, sem significado).
 *
 * Placeholder: todos os valores são provisórios e neutros. Para trocar a identidade
 * visual, edite este arquivo e o mapeamento em `semantic.ts`.
 *
 * Componentes NUNCA usam primitivos: eles só existem para alimentar os tokens
 * semânticos e para a documentação no Storybook. Por isso não viram variáveis CSS.
 */

/**
 * Escala neutra em 11 passos: cinza puro nos tons claros e um leve tom frio nos
 * escuros. A chave indica a luminosidade: 50 é o mais claro e 950 o mais escuro.
 */
export const gray = {
  50: "#ffffff",
  100: "#fafafa",
  200: "#ececec",
  300: "#dedede",
  400: "#8e8e8e",
  500: "#636363",
  600: "#545454",
  700: "#454646",
  800: "#353939",
  900: "#262c2c",
  950: "#0f1113",
} as const;

/** Cor de marca: um amarelo dourado. É clara, então pede texto escuro por cima. */
export const primary = {
  50: "#fffae8",
  100: "#fff5cf",
  200: "#ffeeb7",
  300: "#ffe8a0",
  400: "#ffe18a",
  500: "#fed975",
  600: "#fad161",
  700: "#d7a950",
  800: "#b38440",
  900: "#8c6131",
  950: "#664223",
} as const;

/** Vermelho para erros e ações destrutivas. */
export const red = {
  50: "#fff0f1",
  100: "#ffcbcd",
  200: "#ffa8ab",
  300: "#ff888c",
  400: "#ff6a6e",
  500: "#f94e54",
  600: "#f0353b",
  700: "#cd2a3b",
  800: "#a92038",
  900: "#841731",
  950: "#5e0f28",
} as const;

/** Verde para sucesso e confirmações. */
export const green = {
  50: "#f3ffe6",
  100: "#e2ffc0",
  200: "#d0ff9d",
  300: "#bffd7c",
  400: "#adf65e",
  500: "#9bee42",
  600: "#89e328",
  700: "#63be1e",
  800: "#429816",
  900: "#28710e",
  950: "#134808",
} as const;

/** Laranja para avisos. */
export const orange = {
  50: "#fff7f0",
  100: "#ffe1c8",
  200: "#ffcca0",
  300: "#ffb878",
  400: "#ffa352",
  500: "#ff9033",
  600: "#ff7c17",
  700: "#d26310",
  800: "#a64b0a",
  900: "#793405",
  950: "#4d1f02",
} as const;

/** Escala de espaçamento. A chave é o valor em pixels (com fonte base de 16px). */
export const space = {
  0: "0rem",
  2: "0.125rem",
  4: "0.25rem",
  8: "0.5rem",
  12: "0.75rem",
  16: "1rem",
  24: "1.5rem",
  32: "2rem",
  48: "3rem",
  64: "4rem",
  96: "6rem",
} as const;

/** Raios de canto. Propositalmente pequenos: sem cantos muito arredondados. */
export const radius = {
  0: "0rem",
  2: "0.125rem",
  4: "0.25rem",
  6: "0.375rem",
  full: "9999px",
} as const;

/** Famílias de fonte provisórias: as fontes do sistema operacional. */
export const fontFamily = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
} as const;

/** Tamanhos de fonte. A chave é o valor em pixels. */
export const fontSize = {
  12: "0.75rem",
  14: "0.875rem",
  16: "1rem",
  18: "1.125rem",
  20: "1.25rem",
  24: "1.5rem",
  30: "1.875rem",
  48: "3rem",
} as const;

/** Alturas de linha (multiplicador do tamanho da fonte). */
export const lineHeight = {
  100: "1",
  110: "1.1",
  125: "1.25",
  140: "1.4",
  150: "1.5",
} as const;

/** Pesos de fonte. */
export const fontWeight = {
  400: "400",
  500: "500",
  600: "600",
} as const;

/** Durações de animação. A chave é o valor em milissegundos. */
export const duration = {
  0: "0ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
} as const;
