import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";
import { contrastRatio, toHex, toOklch } from "./color.ts";
import { renderTailwindCss, renderTokensCss } from "./css.ts";
import { gray } from "./primitives.ts";
import { color, contrastPairs, type ThemeName } from "./semantic.ts";

describe("contraste das cores semânticas", () => {
  for (const theme of ["light", "dark"] satisfies ThemeName[]) {
    it.each(contrastPairs)(`${theme}: %s sobre %s ≥ %d:1`, (fg, bg, min) => {
      expect(contrastRatio(color[fg][theme], color[bg][theme])).toBeGreaterThanOrEqual(min);
    });
  }
});

describe("conversão de cor", () => {
  it.each([
    ["oklch(1 0 0)", "#ffffff"],
    ["oklch(0 0 0)", "#000000"],
    ["oklch(100% 0 0)", "#ffffff"],
    ["oklch(98.5% 0.004 90)", "#fbfaf7"],
    ["#0F1113", "#0f1113"],
  ])("%s → %s", (value, hex) => {
    expect(toHex(value)).toBe(hex);
  });

  it.each([
    ["#ffffff", "oklch(100.0% 0.000 0)"],
    ["#000000", "oklch(0.0% 0.000 0)"],
  ])("%s → %s", (value, oklch) => {
    expect(toOklch(value)).toBe(oklch);
  });

  it.each(Object.values(gray))("%s → OKLCH → volta ao mesmo hex", (hex) => {
    expect(toHex(toOklch(hex))).toBe(hex);
  });

  it("contraste entre branco e preto é 21:1", () => {
    expect(contrastRatio("oklch(1 0 0)", "oklch(0 0 0)")).toBeCloseTo(21, 5);
  });
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
