// @vitest-environment jsdom
import { IconTag } from "@tabler/icons-react";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Tag } from "./Tag.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Tag", () => {
  it("mostra o texto e não é um controle", () => {
    render(<Tag>Design</Tag>);
    const tag = screen.getByText("Design");
    expect(tag.tagName).toBe("SPAN");
    expect(tag.getAttribute("role")).toBeNull();
    expect(tag.getAttribute("tabindex")).toBeNull();
  });

  it("o ícone é decorativo: o leitor de tela lê só o texto", () => {
    const { container } = render(<Tag icon={<IconTag />}>Design</Tag>);
    const tag = container.firstElementChild as HTMLElement;
    expect(tag.querySelector("svg")?.closest("[aria-hidden='true']")).toBeTruthy();
    expect(tag.textContent).toBe("Design");
  });

  it("padrão: tom neutro, tamanho md, retangular com canto pequeno", () => {
    render(<Tag>Design</Tag>);
    const { className } = screen.getByText("Design");
    expect(className).toContain("bg-readonly");
    expect(className).toContain("border-subtle");
    expect(className).toContain("h-6");
    expect(className).toContain("rounded-sm");
  });

  it.each([
    ["primary", "bg-primary-subtle", "border-primary", "text-primary"],
    ["info", "bg-info-subtle", "border-info", "text-info"],
    ["success", "bg-success-subtle", "border-success", "text-success"],
    ["caution", "bg-caution-subtle", "border-caution", "text-caution"],
    ["warning", "bg-warning-subtle", "border-warning", "text-warning"],
    ["danger", "bg-danger-subtle", "border-danger", "text-danger"],
  ] as const)("tom %s: fundo %s, borda %s e texto %s", (tone, bg, border, text) => {
    render(<Tag tone={tone}>Design</Tag>);
    const { className } = screen.getByText("Design");
    expect(className).toContain(bg);
    expect(className).toContain(border);
    expect(className).toContain(text);
  });

  it.each([
    ["sm", "h-5", "text-label-xs", "[&_svg]:size-3.5"],
    ["md", "h-6", "text-label-sm", "[&_svg]:size-4"],
  ] as const)("tamanho %s: altura %s, texto %s e ícone %s", (size, height, text, icon) => {
    render(<Tag size={size}>Design</Tag>);
    const { className } = screen.getByText("Design");
    expect(className).toContain(height);
    expect(className).toContain(text);
    expect(className).toContain(icon);
  });

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <p>
        Categoria: <Tag icon={<IconTag />}>Design</Tag>
      </p>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
