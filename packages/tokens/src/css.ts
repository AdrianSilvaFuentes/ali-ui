/**
 * Transforma os tokens semânticos em CSS. Usado pelo build (`scripts/build.ts`)
 * para gerar `dist/tokens.css` e `dist/tailwind.css`, e pelos testes.
 */

import { radius, shadow, spacing } from "./scales.ts";
import {
  color,
  duration,
  elevation,
  font,
  fontWeight,
  gradient,
  gradientCss,
  insetShadow,
  type ThemeName,
  text,
} from "./semantic.ts";

/** Grupos de tokens e o prefixo de cada um nas variáveis CSS. */
export type TokenGroup =
  | "color"
  | "spacing"
  | "radius"
  | "font"
  | "font-weight"
  | "text"
  | "duration"
  | "shadow"
  | "elevation"
  | "inset-shadow"
  | "gradient";

/** Nome da variável CSS de um token. Ex.: `cssVarName("color", "surface")` → `--ali-color-surface`. */
export function cssVarName(group: TokenGroup, key: string): string {
  // Ponto não é permitido em nomes de variáveis CSS: `0.5` vira `0_5`.
  return `--ali-${group}-${key.replaceAll(".", "_")}`;
}

const HEADER = "/* Gerado automaticamente a partir de packages/tokens/src. Não edite à mão. */\n";

function declarations(entries: [string, string][], indent = "  "): string {
  return entries.map(([name, value]) => `${indent}${name}: ${value};`).join("\n");
}

function colorDeclarations(theme: ThemeName, indent?: string): string {
  return declarations(
    Object.entries(color).map(([key, token]) => [cssVarName("color", key), token[theme]]),
    indent,
  );
}

function staticEntries(): [string, string][] {
  return [
    ...Object.entries(spacing).map(([k, v]): [string, string] => [cssVarName("spacing", k), v]),
    ...Object.entries(radius).map(([k, v]): [string, string] => [cssVarName("radius", k), v]),
    ...Object.entries(font).map(([k, v]): [string, string] => [cssVarName("font", k), v]),
    ...Object.entries(fontWeight).map(([k, v]): [string, string] => [
      cssVarName("font-weight", k),
      v,
    ]),
    ...Object.entries(text).flatMap(([k, style]): [string, string][] => [
      [cssVarName("text", k), style.fontSize],
      [`${cssVarName("text", k)}--line-height`, style.lineHeight],
      [`${cssVarName("text", k)}--font-weight`, style.fontWeight],
      [`${cssVarName("text", k)}--letter-spacing`, style.letterSpacing],
    ]),
    ...Object.entries(duration).map(([k, v]): [string, string] => [cssVarName("duration", k), v]),
    ...Object.entries(shadow).map(([k, v]): [string, string] => [cssVarName("shadow", k), v]),
    ...Object.entries(elevation).map(([k, v]): [string, string] => [cssVarName("elevation", k), v]),
    ...Object.entries(insetShadow).map(([k, v]): [string, string] => [
      cssVarName("inset-shadow", k),
      v,
    ]),
    ...Object.entries(gradient).map(([k, v]): [string, string] => [
      cssVarName("gradient", k),
      gradientCss(v),
    ]),
  ];
}

/**
 * Variáveis CSS puras (sem Tailwind). O tema segue a preferência do sistema e pode
 * ser forçado com `data-theme="light"` ou `data-theme="dark"` em qualquer elemento.
 */
export function renderTokensCss(): string {
  return `${HEADER}
/* DM Sans variável (pesos 100 a 1000), servida com o pacote, sem depender do Google. */
@import "@fontsource-variable/dm-sans";

:root,
[data-theme="light"] {
  color-scheme: light;
${colorDeclarations("light")}
}

[data-theme="dark"] {
  color-scheme: dark;
${colorDeclarations("dark")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${colorDeclarations("dark", "    ")}
  }
}

:root {
${declarations(staticEntries())}
}
`;
}

/**
 * Liga os tokens ao Tailwind CSS 4. Apaga os valores padrão do Tailwind (cores,
 * fontes, tamanhos, espaçamentos, raios e sombras) para que só existam classes com
 * nomes semânticos, como `bg-surface`, `text-body-lg`, `p-4`, `rounded-sm` e `shadow-md`.
 */
/** Variáveis de tema do Tailwind para um token de cor, conforme o grupo do nome. */
function colorThemeVars(key: string, value: string): [string, string][] {
  if (key.startsWith("surface")) return [[`--background-color-${key}`, value]];
  if (key.startsWith("background-")) return [[`--background-color-${key.slice(11)}`, value]];
  if (key.startsWith("text-")) return [[`--text-color-${key.slice(5)}`, value]];
  if (key.startsWith("icon-")) return [[`--text-color-${key}`, value]];
  if (key.startsWith("border-")) {
    const name = key.slice(7);
    return [
      [`--border-color-${name}`, value],
      [`--outline-color-${name}`, value],
      [`--ring-color-${name}`, value],
    ];
  }
  // Cores de status ainda valem para qualquer utilitário.
  return [[`--color-${key}`, value]];
}

export function renderTailwindCss(): string {
  const v = (group: TokenGroup, key: string) => `var(${cssVarName(group, key)})`;
  const entries: [string, string][] = [
    ["--color-*", "initial"],
    ["--background-color-*", "initial"],
    ["--text-color-*", "initial"],
    ["--border-color-*", "initial"],
    ["--outline-color-*", "initial"],
    ["--ring-color-*", "initial"],
    ["--font-*", "initial"],
    ["--font-weight-*", "initial"],
    ["--text-*", "initial"],
    ["--spacing-*", "initial"],
    ["--spacing", "initial"],
    ["--radius-*", "initial"],
    ["--shadow-*", "initial"],
    ["--inset-shadow-*", "initial"],
    ["--drop-shadow-*", "initial"],
    ["--text-shadow-*", "initial"],
    ["--transition-duration-*", "initial"],
    // Cada grupo de cor vale só para o seu utilitário: superfícies e fundos em bg-*, textos e
    // ícones em text-*, bordas em border-*, outline-* e ring-*. Assim bg-text-default
    // ou text-surface nem existem.
    ...Object.keys(color).flatMap((k) => colorThemeVars(k, v("color", k))),
    // No tema do Tailwind o ponto vai escapado: `--spacing-0\.5` gera `p-0.5`.
    ...Object.keys(spacing).map((k): [string, string] => [
      `--spacing-${k.replaceAll(".", "\\.")}`,
      v("spacing", k),
    ]),
    ...Object.keys(radius).map((k): [string, string] => [`--radius-${k}`, v("radius", k)]),
    // Só a fonte mono vira classe (font-mono); a de texto é a padrão e não precisa.
    ["--font-mono", v("font", "mono")],
    ...Object.keys(fontWeight).map((k): [string, string] => [
      `--font-weight-${k}`,
      v("font-weight", k),
    ]),
    ...Object.keys(text).flatMap((k): [string, string][] => [
      [`--text-${k}`, v("text", k)],
      [`--text-${k}--line-height`, `var(${cssVarName("text", k)}--line-height)`],
      [`--text-${k}--font-weight`, `var(${cssVarName("text", k)}--font-weight)`],
      [`--text-${k}--letter-spacing`, `var(${cssVarName("text", k)}--letter-spacing)`],
    ]),
    ...Object.keys(duration).map((k): [string, string] => [
      `--transition-duration-${k}`,
      v("duration", k),
    ]),
    ...Object.keys(shadow).map((k): [string, string] => [`--shadow-${k}`, v("shadow", k)]),
    ...Object.keys(elevation).map((k): [string, string] => [`--shadow-${k}`, v("elevation", k)]),
    ...Object.keys(insetShadow).map((k): [string, string] => [
      `--inset-shadow-${k}`,
      v("inset-shadow", k),
    ]),
    ["--default-font-family", v("font", "body")],
    ["--default-mono-font-family", v("font", "mono")],
    ["--default-transition-duration", v("duration", "base")],
  ];

  return `${HEADER}
@import "./tokens.css";

@theme inline {
${declarations(entries)}
}

${Object.keys(gradient)
  .map(
    (
      k,
    ) => `/* Degradê ${k}: o Tailwind 4 não tem tema para degradês, então a classe é criada aqui. */
@utility bg-gradient-${k} {
  background-image: ${v("gradient", k)};
}
`,
  )
  .join("\n")}
@layer base {
  html {
    background-color: var(${cssVarName("color", "surface")});
    color: var(${cssVarName("color", "text-default")});
  }
}
`;
}
