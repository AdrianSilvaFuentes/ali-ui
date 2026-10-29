import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";
import { contrastRatio, toHex, toOklch } from "./color.ts";
import { renderTailwindCss, renderTokensCss } from "./css.ts";
import { neutralLight } from "./primitives.ts";
import { color, contrastPairs, gradient, type ThemeName } from "./semantic.ts";

describe("contraste das cores semânticas", () => {
  for (const theme of ["light", "dark"] satisfies ThemeName[]) {
    it.each(contrastPairs)(`${theme}: %s sobre %s ≥ %d:1`, (fg, bg, min) => {
      expect(contrastRatio(color[fg][theme], color[bg][theme])).toBeGreaterThanOrEqual(min);
    });
  }
});

describe("contraste dos degradês", () => {
  // O texto em static-white precisa de 4.5:1 nas duas pontas, onde o degradê é mais claro.
  const danger = ["danger", "danger-hovered", "danger-pressed"] as const;
  it.each(danger)("static-white sobre %s", (name) => {
    const white = color["text-static-white"].light;
    expect(contrastRatio(white, gradient[name].from)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(white, gradient[name].to)).toBeGreaterThanOrEqual(4.5);
  });
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

  it.each(Object.values(neutralLight))("%s → OKLCH → volta ao mesmo hex", (hex) => {
    expect(toHex(toOklch(hex))).toBe(hex);
  });

  it("contraste entre branco e preto é 21:1", () => {
    expect(contrastRatio("oklch(1 0 0)", "oklch(0 0 0)")).toBeCloseTo(21, 5);
  });
});

describe("tokens.css", () => {
  const css = renderTokensCss();

  it("carrega a DM Sans e a usa como fonte padrão", () => {
    expect(css).toContain('@import "@fontsource-variable/dm-sans/opsz.css";');
    expect(css).toContain('--ali-font-body: "DM Sans Variable"');
  });

  it("define o espaçamento entre letras de cada estilo de texto", () => {
    expect(css).toContain("--ali-text-body-md--letter-spacing: 0em;");
    expect(css).toContain("--ali-text-display--letter-spacing: 0em;");
  });

  it("usa o mesmo nome do grupo nas variáveis de dimensão", () => {
    expect(css).toContain("--ali-spacing-0_5: 0.125rem;");
    expect(css).toContain("--ali-radius-md: 0.375rem;");
    expect(css).toContain("--ali-shadow-md: ");
    expect(css).not.toContain("--ali-space-");
  });

  it("mantém as cores static iguais nos dois temas", () => {
    for (const [name, token] of Object.entries(color)) {
      if (name.includes("static")) expect(token.light).toBe(token.dark);
    }
  });

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
    "bg-surface",
    "bg-surface-sunken",
    "bg-surface-overlay",
    "bg-disabled",
    "bg-readonly",
    "bg-selected",
    "bg-neutral",
    "bg-neutral-hovered",
    "bg-neutral-pressed",
    "bg-danger-subtle-hovered",
    "bg-danger-subtle-pressed",
    "bg-gradient-brand",
    "bg-gradient-brand-hovered",
    "bg-gradient-brand-pressed",
    "bg-gradient-danger",
    "bg-gradient-danger-hovered",
    "bg-gradient-danger-pressed",
    "inset-shadow-highlight",
    "inset-shadow-sunken",
    "shadow-raised",
    "shadow-overlay",
    "text-default",
    "text-subtle",
    "text-placeholder",
    "text-disabled",
    "text-link",
    "text-icon-default",
    "text-icon-subtle",
    "text-icon-success",
    "text-icon-danger",
    "text-inverse",
    "text-static-white",
    "text-icon-static-black",
    "border-default",
    "border-subtle",
    "border-disabled",
    "border-success",
    "border-danger",
    "outline-danger",
    "outline-focus",
    "ring-focus",
    "text-success",
    "text-caution",
    "text-warning",
    "text-danger",
    "text-info",
    "p-0",
    "p-px",
    "p-0.5",
    "p-4",
    "gap-2",
    "w-32",
    "-mt-4",
    "rounded-none",
    "rounded-sm",
    "rounded-3xl",
    "rounded-full",
    "text-body-md",
    "text-label-xs",
    "font-mono",
    "font-semibold",
    "duration-fast",
    "shadow-2xs",
    "shadow-md",
    "shadow-2xl",
  ];

  it.each(semanticClasses)("gera a classe semântica %s", async (cls) => {
    // No CSS gerado, o ponto do nome da classe vem escapado: `.p-0\\.5`.
    expect(await buildUtilities([cls])).toContain(`.${cls.replaceAll(".", "\\.")} {`);
  });

  // Classes padrão do Tailwind que expõem valores fora dos tokens.
  const removedClasses = [
    "bg-gray-500",
    // Nomes antigos de texto e borda.
    "text-foreground",
    "text-muted-foreground",
    "border-border",
    "border-strong",
    "outline-focus-ring",
    // Cada grupo de cor só vale para o seu utilitário.
    "bg-default",
    "bg-text-default",
    "text-surface",
    "border-surface",
    "bg-border-default",
    "bg-background-brand",
    "bg-brand",
    "text-brand",
    // Fundos de status voltam com a página Semantic.
    "bg-danger",
    "text-danger-foreground",
    "bg-muted",
    "text-body",
    "text-label",
    "text-caption",
    "text-heading-md",
    "font-heading",
    "font-strong",
    "font-body",
    "font-title",
    "bg-primary",
    "text-red-600",
    "bg-white",
    "p-13",
    "p-4.5",
    "w-40",
    "p-md",
    "text-sm",
    "rounded-xs",
    "rounded-4xl",
    "shadow-inner",
    "inset-shadow-sm",
    "drop-shadow-md",
    "font-sans",
  ];

  it.each(removedClasses)("não gera a classe padrão %s", async (cls) => {
    expect(await buildUtilities([cls])).not.toContain(`.${cls.replaceAll(".", "\\.")} {`);
  });
});
