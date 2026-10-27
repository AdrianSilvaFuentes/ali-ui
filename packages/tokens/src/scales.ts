/**
 * Escalas de dimensão: espaçamento, raios e sombras.
 *
 * Têm uma camada só: não existe uma versão "primitiva" e outra "semântica", porque
 * esses valores não têm papéis (como "fundo" ou "texto"), só tamanhos. Os nomes são
 * os do Tailwind CSS 4, e cada grupo usa o mesmo nome no TypeScript, na variável
 * CSS e na classe: `spacing` → `--ali-spacing-4` → `p-4`.
 */

/**
 * Escala de espaçamento: a escala numérica padrão do Tailwind CSS 4.
 * Cada passo vale 4px (0.25rem); `px` vale 1px.
 */
export const spacing = {
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
