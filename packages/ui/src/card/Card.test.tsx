// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "./Card.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Card", () => {
  it("é uma div com o conteúdo e não é um controle", () => {
    render(<Card>Conteúdo</Card>);
    const card = screen.getByText("Conteúdo");
    expect(card.tagName).toBe("DIV");
    expect(card.getAttribute("role")).toBeNull();
    expect(card.getAttribute("tabindex")).toBeNull();
  });

  it("padrão: raised, padding md, canto xl, contorno sutil", () => {
    render(<Card>Conteúdo</Card>);
    const { className } = screen.getByText("Conteúdo");
    expect(className).toContain("bg-surface-raised");
    expect(className).toContain("shadow-xs");
    expect(className).toContain("inset-shadow-highlight");
    expect(className).toContain("p-4");
    expect(className).toContain("rounded-xl");
    expect(className).toContain("border-subtle");
  });

  it("sunken: superfície sunken e sem sombra", () => {
    render(<Card variant="sunken">Conteúdo</Card>);
    const { className } = screen.getByText("Conteúdo");
    expect(className).toContain("bg-surface-sunken");
    expect(className).not.toContain("bg-surface-raised");
    expect(className).not.toMatch(/\bshadow-/);
  });

  it.each([
    ["none", "overflow-hidden"],
    ["sm", "p-3"],
    ["md", "p-4"],
    ["lg", "p-5"],
  ] as const)("padding %s: %s", (padding, cls) => {
    render(<Card padding={padding}>Conteúdo</Card>);
    expect(screen.getByText("Conteúdo").className).toContain(cls);
  });

  it("padding none não tem respiro", () => {
    render(<Card padding="none">Conteúdo</Card>);
    expect(screen.getByText("Conteúdo").className).not.toMatch(/\bp-\d/);
  });

  it("asChild usa o filho como elemento, com o estilo do card", () => {
    render(
      <Card asChild>
        <section aria-label="Resumo">Conteúdo</section>
      </Card>,
    );
    const card = screen.getByRole("region", { name: "Resumo" });
    expect(card.tagName).toBe("SECTION");
    expect(card.className).toContain("bg-surface-raised");
  });

  it("junta o className de fora sem perder o estilo", () => {
    render(<Card className="max-w-sm">Conteúdo</Card>);
    const { className } = screen.getByText("Conteúdo");
    expect(className).toContain("max-w-sm");
    expect(className).toContain("rounded-xl");
  });

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <Card asChild>
        <section aria-labelledby="t">
          <h2 id="t">Total do mês</h2>
          <p>R$ 1.284,90</p>
        </section>
      </Card>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
