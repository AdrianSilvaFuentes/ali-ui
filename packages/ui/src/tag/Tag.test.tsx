// @vitest-environment jsdom
import { IconTag } from "@tabler/icons-react";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("padrão: tom neutro, tamanho md, sombra mínima, brilho no topo e sem borda", () => {
    render(<Tag>Design</Tag>);
    const { className } = screen.getByText("Design");
    expect(className).toContain("bg-neutral-subtle");
    expect(className).toContain("h-6");
    expect(className).toContain("shadow-xs");
    expect(className).toContain("inset-shadow-highlight");
    expect(className).not.toMatch(/\bborder\b/);
  });

  it.each([
    ["primary", "bg-primary-subtle", "text-primary"],
    ["info", "bg-info-subtle", "text-info"],
    ["success", "bg-success-subtle", "text-success"],
    ["caution", "bg-caution-subtle", "text-caution"],
    ["warning", "bg-warning-subtle", "text-warning"],
    ["danger", "bg-danger-subtle", "text-danger"],
  ] as const)("tom %s: fundo %s e texto %s", (tone, bg, text) => {
    render(<Tag tone={tone}>Design</Tag>);
    const { className } = screen.getByText("Design");
    expect(className).toContain(bg);
    expect(className).toContain(text);
  });

  it.each([
    ["sm", "h-5", "rounded-sm", "text-label-sm", "[&_svg]:size-3"],
    ["md", "h-6", "rounded-md", "text-label-sm", "[&_svg]:size-3.5"],
  ] as const)(
    "tamanho %s: altura %s, canto %s, texto %s e ícone %s",
    (size, height, corner, text, icon) => {
      render(<Tag size={size}>Design</Tag>);
      const { className } = screen.getByText("Design");
      expect(className).toContain(height);
      expect(className).toContain(corner);
      expect(className).toContain(text);
      expect(className).toContain(icon);
    },
  );

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <p>
        Categoria: <Tag icon={<IconTag />}>Design</Tag>
      </p>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Tag com X de remover", () => {
  it("sem onRemove, não tem botão", () => {
    render(<Tag>Design</Tag>);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("o X é um botão com o nome da tag, e o ícone não é anunciado", () => {
    render(<Tag onRemove={() => {}}>Design</Tag>);
    const button = screen.getByRole("button", { name: "Remover Design" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("removeLabel troca o nome do botão", () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Tirar filtro Design">
        Design
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Tirar filtro Design" })).toBeTruthy();
  });

  it("clicar no X chama onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Design</Tag>);
    await user.click(screen.getByRole("button"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it.each(["{Enter}", " ", "{Delete}", "{Backspace}"])(
    "com foco no X, %s chama onRemove",
    async (key) => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<Tag onRemove={onRemove}>Design</Tag>);
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole("button"));
      await user.keyboard(key);
      expect(onRemove).toHaveBeenCalledTimes(1);
    },
  );

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(
      <Tag onRemove={() => {}} icon={<IconTag />}>
        Design
      </Tag>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
