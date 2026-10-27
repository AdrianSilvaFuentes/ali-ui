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

/** Amarelo para destaques informativos e atenção leve. */
export const yellow = {
  50: "#fffff0",
  100: "#ffffc8",
  200: "#fffca0",
  300: "#fff778",
  400: "#fff052",
  500: "#ffe733",
  600: "#ffdc17",
  700: "#d3a11e",
  800: "#aa7422",
  900: "#855123",
  950: "#623821",
} as const;

/** Azul para informações. */
export const blue = {
  50: "#eefcff",
  100: "#cdf5fe",
  200: "#ace9fd",
  300: "#8bdafc",
  400: "#6bc6fc",
  500: "#4ab0fb",
  600: "#2995fa",
  700: "#2172c9",
  800: "#195298",
  900: "#103466",
  950: "#081935",
} as const;

/**
 * Escala de espaçamento: a escala numérica padrão do Tailwind CSS 4.
 * Cada passo vale 4px (0.25rem); `px` vale 1px.
 */
export const space = {
  "0": "0rem",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
} as const;

/** Raios de canto: os valores padrão do Tailwind CSS 4, de none a 3xl, mais full. */
export const radius = {
  none: "0px",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
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

/** Sombras: os valores padrão do Tailwind CSS 4, sem alterações. */
export const shadow = {
  "2xs": "0 1px rgb(0 0 0 / 0.05)",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
} as const;
