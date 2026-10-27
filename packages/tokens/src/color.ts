/**
 * Conversões de cor usadas pela documentação e pelos testes de acessibilidade.
 * Aceitam cores em hex (`#rrggbb`) ou OKLCH (`oklch(L C H)`).
 */

/** Lê `oklch(L C H)`, com a luminosidade em número (0.985) ou porcentagem (98.5%). */
function parseOklch(value: string): [number, number, number] {
  const match = /^oklch\(([\d.]+)(%?) ([\d.]+) ([\d.]+)\)$/.exec(value);
  if (!match) throw new Error(`Formato de cor não suportado: ${value}`);
  const [, lightness = "", percent, chroma = "", hue = ""] = match;
  return [Number(lightness) / (percent ? 100 : 1), Number(chroma), Number(hue)];
}

const decode = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const encode = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

/** sRGB linear (0 a 1 por canal), limitado ao que a tela consegue mostrar. */
function toLinearRgb(value: string): [number, number, number] {
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(value);
  if (hex) {
    return hex.slice(1).map((channel) => decode(Number.parseInt(channel, 16) / 255)) as [
      number,
      number,
      number,
    ];
  }
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

/** Cor em hex (`#rrggbb`). */
export function toHex(value: string): string {
  return `#${toLinearRgb(value)
    .map((x) =>
      Math.round(encode(x) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Cor em OKLCH, no formato `oklch(98.5% 0.004 90)`. */
export function toOklch(value: string): string {
  const [r, g, b] = toLinearRgb(value);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  // Sem croma, o matiz não tem significado: mostra 0.
  const H = C < 0.0005 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(0)})`;
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
