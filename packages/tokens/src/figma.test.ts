import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { figmaPrimitives, figmaTokens, renderFigmaManifest, renderFigmaPlugin } from "./figma.ts";
import { color } from "./semantic.ts";

describe("sincronização com o Figma", () => {
  const primitives = figmaPrimitives();
  const tokens = figmaTokens();
  const primitiveNames = new Set(primitives.map((p) => p.name));

  it("tem um token no Figma para cada token de cor do código", () => {
    expect(tokens).toHaveLength(Object.keys(color).length);
  });

  it("não repete nomes", () => {
    expect(new Set(tokens.map((t) => t.name)).size).toBe(tokens.length);
    expect(primitiveNames.size).toBe(primitives.length);
  });

  it.each(tokens)("$name aponta para primitivos que existem", (token) => {
    expect(primitiveNames.has(token.light)).toBe(true);
    expect(primitiveNames.has(token.dark)).toBe(true);
  });

  it("usa nomes que o Figma aceita (sem ponto)", () => {
    for (const { name } of [...primitives, ...tokens]) expect(name).not.toContain(".");
  });

  it("mantém os caminhos já usados no arquivo do Figma", () => {
    const names = tokens.map((t) => t.name);
    expect(names).toContain("surface/default");
    expect(names).toContain("surface/raised");
    expect(names).toContain("text/default");
    expect(names).toContain("text/status/success");
    expect(names).toContain("icon/special/inverse");
    expect(names).toContain("border/subtle");
  });

  it("gera um plugin com código JavaScript válido", () => {
    expect(() => new Function(renderFigmaPlugin())).not.toThrow();
  });

  it("o plugin na pasta figma-plugin está em dia com os tokens (rode pnpm build)", () => {
    const read = (file: string) =>
      readFileSync(new URL(`../figma-plugin/${file}`, import.meta.url), "utf8");
    expect(read("code.js")).toBe(renderFigmaPlugin());
    expect(read("manifest.json")).toBe(renderFigmaManifest());
  });
});
