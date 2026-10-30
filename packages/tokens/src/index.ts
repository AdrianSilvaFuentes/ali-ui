/**
 * Design tokens da Ali UI: os valores semânticos que os componentes podem usar.
 *
 * Os primitivos ficam em `@ali/tokens/primitives` e servem só para documentação.
 */
import { cssVarName, type TokenGroup } from "./css.ts";

export { cssVarName, type TokenGroup };

import { radius, shadow, spacing } from "./scales.ts";
import {
  brandPalettes,
  brandTokens,
  color,
  contrastMore,
  contrastPairs,
  duration,
  elevation,
  font,
  fontWeight,
  gradient,
  gradientCss,
  insetShadow,
  insetShadowDark,
  text,
} from "./semantic.ts";

export type {
  BrandName,
  ColorName,
  ColorToken,
  GradientName,
  GradientToken,
  TextStyle,
  ThemeName,
} from "./semantic.ts";
export {
  brandPalettes,
  brandTokens,
  color,
  contrastMore,
  contrastPairs,
  duration,
  elevation,
  font,
  fontWeight,
  gradient,
  gradientCss,
  insetShadow,
  insetShadowDark,
  radius,
  shadow,
  spacing,
  text,
};

type VarMap<T> = { readonly [K in keyof T]: string };

function varsOf<T extends object>(group: TokenGroup, tokens: T): VarMap<T> {
  return Object.fromEntries(
    Object.keys(tokens).map((key) => [key, `var(${cssVarName(group, key)})`]),
  ) as VarMap<T>;
}

/**
 * Referências às variáveis CSS, para uso em estilos inline.
 * Ex.: `vars.color.surface` → `"var(--ali-color-surface)"`.
 */
export const vars = {
  color: varsOf("color", color),
  spacing: varsOf("spacing", spacing),
  radius: varsOf("radius", radius),
  font: varsOf("font", font),
  fontWeight: varsOf("font-weight", fontWeight),
  text: varsOf("text", text),
  duration: varsOf("duration", duration),
  shadow: varsOf("shadow", shadow),
  elevation: varsOf("elevation", elevation),
  gradient: varsOf("gradient", gradient),
  insetShadow: varsOf("inset-shadow", insetShadow),
} as const;
