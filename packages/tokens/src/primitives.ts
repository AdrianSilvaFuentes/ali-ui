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
 * Escala neutra com um leve tom quente (croma 0.004, matiz 90), quase imperceptível.
 * A chave indica a luminosidade: 50 é o mais claro e 950 o mais escuro. Sem branco
 * nem preto puros e sem o passo 700, que não tinha uso.
 */
export const gray = {
  50: "oklch(98.5% 0.004 90)",
  100: "oklch(97% 0.004 90)",
  200: "oklch(92.2% 0.004 90)",
  300: "oklch(87% 0.004 90)",
  400: "oklch(70.8% 0.004 90)",
  500: "oklch(55.6% 0.004 90)",
  600: "oklch(43.9% 0.004 90)",
  800: "oklch(26.9% 0.004 90)",
  900: "oklch(20.5% 0.004 90)",
  950: "oklch(14.5% 0.004 90)",
} as const;

/** Cor de destaque provisória (azul genérico, a ser substituído pela identidade). */
export const accent = {
  100: "oklch(0.932 0.032 255.6)",
  300: "oklch(0.809 0.105 251.8)",
  400: "oklch(0.707 0.165 254.6)",
  500: "oklch(0.623 0.214 259.8)",
  600: "oklch(0.546 0.245 262.9)",
  700: "oklch(0.488 0.243 264.4)",
  900: "oklch(0.379 0.146 265.5)",
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
