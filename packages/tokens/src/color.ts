/**
 * Conversões de cor usadas pela documentação e pelos testes de acessibilidade:
 * OKLCH → sRGB, hex e contraste WCAG.
 */

/** Lê `oklch(L C H)`, com a luminosidade em número (0.985) ou porcentagem (98.5%). */
function parseOklch(value: string): [number, number, number] {
  const match = /^oklch\(([\d.]+)(%?) ([\d.]+) ([\d.]+)\)$/.exec(value);
  if (!match) throw new Error(`Formato de cor não suportado: ${value}`);
  const [, lightness = "", percent, chroma = "", hue = ""] = match;
  return [Number(lightness) / (percent ? 100 : 1), Number(chroma), Number(hue)];
}

/** sRGB linear (0 a 1 por canal), limitado ao que a tela consegue mostrar. */
function toLinearRgb(value: string): [number, number, number] {
  const [L, C, H] = parseOklch(value);
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Cor OKLCH em hex (`#rrggbb`). */
export function toHex(value: string): string {
  const encode = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
  return `#${toLinearRgb(value)
    .map((x) =>
      Math.round(encode(x) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Luminância relativa (WCAG). */
function luminance(value: string): number {
  const [r, g, b] = toLinearRgb(value);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores, de 1 a 21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
