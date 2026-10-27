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

/** Cor de marca: um verde-menta. É clara, então pede texto escuro por cima. */
export const primary = {
  50: "#f0fff9",
  100: "#c8ffea",
  200: "#a3ffda",
  300: "#80ffca",
  400: "#60feba",
  500: "#43f7a9",
  600: "#28ed98",
  700: "#26bf92",
  800: "#219381",
  900: "#1b6967",
  950: "#133b41",
} as const;

/** Vermelho para estados de erro. */
export const red = {
  400: "oklch(0.704 0.191 22.2)",
  500: "oklch(0.637 0.237 25.3)",
  600: "oklch(0.577 0.245 27.3)",
  700: "oklch(0.505 0.213 27.5)",
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
