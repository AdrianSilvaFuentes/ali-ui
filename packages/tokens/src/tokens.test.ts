import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";
import { renderTailwindCss, renderTokensCss } from "./css.ts";
import { color, type ThemeName } from "./semantic.ts";

/** Luminância relativa (WCAG) de uma cor `oklch(L C H)`. */
function luminance(oklch: string): number {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(oklch);
  if (!match) throw new Error(`Formato não suportado: ${oklch}`);
  const [L, C, H] = match.slice(1).map(Number) as [number, number, number];
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

type ColorName = keyof typeof color;

// Pares de cores que aparecem juntos e o contraste mínimo exigido pela WCAG AA:
// 4.5:1 para texto, 3:1 para contornos de controles e foco.
const pairs: [ColorName, ColorName, number][] = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "muted", 4.5],
  ["muted-foreground", "background", 4.5],
  ["muted-foreground", "surface", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["accent", "background", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["accent-foreground", "accent-hover", 4.5],
  ["danger", "background", 4.5],
  ["danger-foreground", "danger", 4.5],
  ["border-strong", "background", 3],
  ["border-strong", "surface", 3],
  ["focus-ring", "background", 3],
  ["focus-ring", "surface", 3],
];

describe("contraste das cores semânticas", () => {
  for (const theme of ["light", "dark"] satisfies ThemeName[]) {
    it.each(pairs)(`${theme}: %s sobre %s ≥ %d:1`, (fg, bg, min) => {
      expect(contrast(color[fg][theme], color[bg][theme])).toBeGreaterThanOrEqual(min);
    });
  }
});

describe("tokens.css", () => {
  const css = renderTokensCss();

  it("define todas as cores semânticas nos temas claro e escuro", () => {
    for (const [name, token] of Object.entries(color)) {
      expect(css).toContain(`--ali-color-${name}: ${token.light};`);
      expect(css).toContain(`--ali-color-${name}: ${token.dark};`);
    }
  });
});

describe("integração com o Tailwind", () => {
  const require = createRequire(import.meta.url);

  async function buildUtilities(candidates: string[]): Promise<string> {
    const input = `@import "tailwindcss";\n${renderTailwindCss().replace('@import "./tokens.css";', "")}`;
    const compiler = await compile(input, {
      base: process.cwd(),
      async loadStylesheet(id) {
        const path = require.resolve(id === "tailwindcss" ? "tailwindcss/index.css" : id);
        return { path, base: dirname(path), content: await readFile(path, "utf8") };
      },
    });
    return compiler.build(candidates);
  }

  const semanticClasses = [
    "bg-background",
    "text-foreground",
    "border-border-strong",
    "outline-focus-ring",
    "p-md",
    "gap-xs",
    "rounded-control",
    "text-body",
    "font-heading",
    "font-strong",
    "duration-fast",
  ];

  it.each(semanticClasses)("gera a classe semântica %s", async (cls) => {
    expect(await buildUtilities([cls])).toContain(`.${cls} {`);
  });

  // Classes padrão do Tailwind que expõem valores fora dos tokens.
  const removedClasses = [
    "bg-gray-500",
    "text-red-600",
    "bg-white",
    "p-4",
    "text-sm",
    "rounded-lg",
    "shadow-md",
    "font-sans",
  ];

  it.each(removedClasses)("não gera a classe padrão %s", async (cls) => {
    expect(await buildUtilities([cls])).not.toContain(`.${cls} {`);
  });
});
