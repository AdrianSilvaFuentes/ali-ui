/**
 * Transforma os tokens semânticos em CSS. Usado pelo build (`scripts/build.ts`)
 * para gerar `dist/tokens.css` e `dist/tailwind.css`, e pelos testes.
 */
import {
  color,
  duration,
  font,
  fontWeight,
  radius,
  shadow,
  spacing,
  type ThemeName,
  text,
} from "./semantic.ts";

/** Grupos de tokens e o prefixo de cada um nas variáveis CSS. */
export type TokenGroup =
  | "color"
  | "space"
  | "radius"
  | "font"
  | "font-weight"
  | "text"
  | "duration"
  | "shadow";

/** Nome da variável CSS de um token. Ex.: `cssVarName("color", "background")` → `--ali-color-background`. */
export function cssVarName(group: TokenGroup, key: string): string {
  return `--ali-${group}-${key}`;
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
    ...Object.entries(spacing).map(([k, v]): [string, string] => [cssVarName("space", k), v]),
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
    ]),
    ...Object.entries(duration).map(([k, v]): [string, string] => [cssVarName("duration", k), v]),
    ...Object.entries(shadow).map(([k, v]): [string, string] => [cssVarName("shadow", k), v]),
  ];
}

/**
 * Variáveis CSS puras (sem Tailwind). O tema segue a preferência do sistema e pode
 * ser forçado com `data-theme="light"` ou `data-theme="dark"` em qualquer elemento.
 */
export function renderTokensCss(): string {
  return `${HEADER}
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
 * nomes semânticos, como `bg-background`, `text-body`, `p-md`, `rounded-control` e `shadow-md`.
 */
export function renderTailwindCss(): string {
  const v = (group: TokenGroup, key: string) => `var(${cssVarName(group, key)})`;
  const entries: [string, string][] = [
    ["--color-*", "initial"],
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
    ...Object.keys(color).map((k): [string, string] => [`--color-${k}`, v("color", k)]),
    ...Object.keys(spacing).map((k): [string, string] => [`--spacing-${k}`, v("space", k)]),
    ...Object.keys(radius).map((k): [string, string] => [`--radius-${k}`, v("radius", k)]),
    ...Object.keys(font).map((k): [string, string] => [`--font-${k}`, v("font", k)]),
    ...Object.keys(fontWeight).map((k): [string, string] => [
      `--font-weight-${k}`,
      v("font-weight", k),
    ]),
    ...Object.keys(text).flatMap((k): [string, string][] => [
      [`--text-${k}`, v("text", k)],
      [`--text-${k}--line-height`, `var(${cssVarName("text", k)}--line-height)`],
      [`--text-${k}--font-weight`, `var(${cssVarName("text", k)}--font-weight)`],
    ]),
    ...Object.keys(duration).map((k): [string, string] => [
      `--transition-duration-${k}`,
      v("duration", k),
    ]),
    ...Object.keys(shadow).map((k): [string, string] => [`--shadow-${k}`, v("shadow", k)]),
    ["--default-font-family", v("font", "body")],
    ["--default-mono-font-family", v("font", "mono")],
    ["--default-transition-duration", v("duration", "base")],
  ];

  return `${HEADER}
@import "./tokens.css";

@theme inline {
${declarations(entries)}
}

@layer base {
  html {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
`;
}
