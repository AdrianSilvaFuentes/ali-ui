// @vitest-environment jsdom
import { IconCheck } from "@tabler/icons-react";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "./Badge.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Badge", () => {
  it("mostra o texto e não é um controle", () => {
    render(<Badge>Ativo</Badge>);
    const badge = screen.getByText("Ativo");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("role")).toBeNull();
    expect(badge.getAttribute("tabindex")).toBeNull();
  });

  it("padrão: tom neutral, tamanho md, pílula, sombra mínima e sem borda", () => {
    render(<Badge>Ativo</Badge>);
    const { className } = screen.getByText("Ativo");
    expect(className).toContain("bg-neutral-subtle");
    expect(className).toContain("text-default");
    expect(className).toContain("h-6");
    expect(className).toContain("rounded-full");
    expect(className).toContain("shadow-xs");
    expect(className).not.toMatch(/\bborder\b/);
  });

  it.each([
    ["info", "text-info"],
    ["success", "text-success"],
    ["caution", "text-caution"],
    ["warning", "text-warning"],
    ["danger", "text-danger"],
  ] as const)("tom %s: fundo, texto e ícone nos tokens de status", (tone, text) => {
    render(<Badge tone={tone}>Status</Badge>);
    const { className } = screen.getByText("Status");
    expect(className).toContain(`bg-${tone}-subtle`);
    expect(className).toContain(text);
    expect(className).toContain(`[&_svg]:text-icon-${tone}`);
    // Status, não categoria: nenhum token de categoria no badge.
    expect(className).not.toContain("category");
  });

  it.each([
    ["sm", "h-5", "px-2", "pl-1.5", "[&_[data-slot=badge-icon]_svg]:size-3"],
    ["md", "h-6", "px-2.5", "pl-2", "[&_[data-slot=badge-icon]_svg]:size-3.5"],
  ] as const)(
    "tamanho %s: altura %s, lados %s, %s com ícone",
    (size, height, sides, left, icon) => {
      const { rerender } = render(<Badge size={size}>Ativo</Badge>);
      let { className } = screen.getByText("Ativo");
      expect(className).toContain(height);
      expect(className).toContain(sides);
      expect(className).toContain("text-label-sm");
      expect(className).toContain(icon);
      expect(className).not.toContain(left);

      rerender(
        <Badge size={size} icon={<IconCheck />}>
          Ativo
        </Badge>,
      );
      ({ className } = screen.getByText("Ativo"));
      expect(className).toContain(left);
    },
  );

  it("o ícone vem antes do texto e é decorativo", () => {
    const { container } = render(<Badge icon={<IconCheck />}>Ativo</Badge>);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
    expect(badge.firstElementChild?.querySelector("svg")).toBeTruthy();
    expect(badge.textContent).toBe("Ativo");
  });

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <p>
        Pedido:{" "}
        <Badge tone="success" icon={<IconCheck />}>
          Entregue
        </Badge>
      </p>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
