/**
 * Design tokens da Ali UI: os valores semânticos que os componentes podem usar.
 *
 * Os primitivos ficam em `@ali/tokens/primitives` e servem só para documentação.
 */
import { cssVarName, type TokenGroup } from "./css.ts";
import {
  color,
  contrastPairs,
  duration,
  font,
  fontWeight,
  radius,
  shadow,
  spacing,
  text,
} from "./semantic.ts";

export type { ColorName, ColorToken, TextStyle, ThemeName } from "./semantic.ts";
export { color, contrastPairs, duration, font, fontWeight, radius, shadow, spacing, text };

type VarMap<T> = { readonly [K in keyof T]: string };

function varsOf<T extends object>(group: TokenGroup, tokens: T): VarMap<T> {
  return Object.fromEntries(
    Object.keys(tokens).map((key) => [key, `var(${cssVarName(group, key)})`]),
  ) as VarMap<T>;
}

/**
 * Referências às variáveis CSS, para uso em estilos inline.
 * Ex.: `vars.color.background` → `"var(--ali-color-background)"`.
 */
export const vars = {
  color: varsOf("color", color),
  space: varsOf("space", spacing),
  radius: varsOf("radius", radius),
  font: varsOf("font", font),
  fontWeight: varsOf("font-weight", fontWeight),
  text: varsOf("text", text),
  duration: varsOf("duration", duration),
  shadow: varsOf("shadow", shadow),
} as const;
