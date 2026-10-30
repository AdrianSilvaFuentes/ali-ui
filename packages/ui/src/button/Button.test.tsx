// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Button", () => {
  it("é um botão com nome acessível e não envia formulários sem querer", () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button.getAttribute("type")).toBe("button");
  });

  it("aceita type submit", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("funciona com mouse e teclado (Tab, Enter, Espaço)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("desabilitado não recebe clique nem foco", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );
    const button = screen.getByRole("button");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    await user.click(button);
    await user.tab();
    expect(onClick).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(button);
  });

  it("mostra o cursor de clique, e o de não permitido quando desabilitado", () => {
    render(<Button>Salvar</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("cursor-pointer");
    expect(className).toContain("disabled:cursor-not-allowed");
    expect(className).toContain("aria-disabled:cursor-not-allowed");
  });

  it("com asChild vira um link com aparência de botão", () => {
    render(
      <Button asChild>
        <a href="/novo">Criar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Criar" });
    expect(link.getAttribute("href")).toBe("/novo");
    expect(link.getAttribute("type")).toBeNull();
    expect(link.className).toContain("bg-gradient-brand");
  });

  it("coloca iconLeft antes e iconRight depois do texto, escondidos do leitor de tela", () => {
    render(
      <Button iconLeft={<svg data-testid="left" />} iconRight={<svg data-testid="right" />}>
        Continuar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Continuar" });
    const left = screen.getByTestId("left");
    const right = screen.getByTestId("right");
    expect(button.firstElementChild?.contains(left)).toBe(true);
    expect(button.lastElementChild?.contains(right)).toBe(true);
    expect(left.parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(right.parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  it("sem ícone não deixa elementos vazios", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button").children).toHaveLength(0);
  });

  it("com asChild, os ícones entram dentro do link", () => {
    render(
      <Button asChild iconLeft={<svg data-testid="left" />}>
        <a href="/novo">Criar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Criar" });
    expect(link.contains(screen.getByTestId("left"))).toBe(true);
  });

  it.each([
    ["sm", "h-8", "rounded-lg"],
    ["md", "h-10", "rounded-xl"],
  ] as const)("tamanho %s usa a altura %s e o raio %s", (size, height, radius) => {
    render(<Button size={size}>Salvar</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain(height);
    expect(className).toContain(radius);
  });

  it("aceita classes extras sem perder as do token", () => {
    render(<Button className="w-full">Salvar</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("w-full");
    expect(className).toContain("text-static-white");
    expect(className).toContain("shadow-xs");
    expect(className).toContain("inset-shadow-highlight");
  });

  it("escurece um degrau a cada estado, com transição suave", () => {
    render(<Button>Salvar</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("before:bg-gradient-brand-hovered");
    expect(className).toContain("hover:before:opacity-100");
    expect(className).toContain("after:bg-gradient-brand-pressed");
    expect(className).toContain("active:after:opacity-100");
    expect(className).toContain("before:transition-opacity");
  });

  it("secondary é neutro, com borda, e sem as camadas de degradê do primary", () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("bg-neutral");
    expect(className).toContain("border-subtle");
    expect(className).toContain("text-default");
    expect(className).toContain("hover:bg-neutral-hovered");
    expect(className).toContain("active:bg-neutral-pressed");
    expect(className).not.toContain("gradient");
  });

  it("ghost não tem fundo, borda nem sombra, só o fundo neutro no hover e ao pressionar", () => {
    render(<Button variant="ghost">Mais opções</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("bg-transparent");
    expect(className).toContain("text-default");
    expect(className).toContain("hover:bg-neutral-hovered");
    expect(className).toContain("active:bg-neutral-pressed");
    expect(className).not.toMatch(/(^|\s)(border|shadow-xs|inset-shadow-highlight)(\s|$)/);
    expect(className).not.toContain("gradient");
  });

  it("destructive usa os degradês de risco, com texto branco", () => {
    render(<Button variant="destructive">Excluir</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("bg-gradient-danger");
    expect(className).toContain("before:bg-gradient-danger-hovered");
    expect(className).toContain("after:bg-gradient-danger-pressed");
    expect(className).toContain("text-static-white");
    expect(className).not.toContain("gradient-brand");
  });

  it("destructive-secondary tem borda e texto de risco e fundo rosado no hover", () => {
    render(<Button variant="destructive-secondary">Excluir conta</Button>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("bg-neutral");
    expect(className).toContain("border-danger");
    expect(className).toContain("text-danger");
    expect(className).toContain("hover:bg-danger-subtle-hovered");
    expect(className).toContain("active:bg-danger-subtle-pressed");
    expect(className).not.toContain("gradient");
  });

  it.each(["primary", "secondary", "ghost", "destructive", "destructive-secondary"] as const)(
    "%s tem o foco visível na cor de foco",
    (variant) => {
      render(<Button variant={variant}>Salvar</Button>);
      const { className } = screen.getByRole("button");
      expect(className).toContain("outline-focus");
      expect(className).toContain("focus-visible:outline-2");
      expect(className).toContain("focus-visible:outline-offset-2");
    },
  );

  it("não tem problemas de acessibilidade, com texto ou só ícone", async () => {
    const { container } = render(
      <div>
        <Button>Salvar</Button>
        <Button aria-label="Pesquisar">
          <svg aria-hidden="true" />
        </Button>
        <Button disabled>Salvar</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="secondary" disabled>
          Cancelar
        </Button>
        <Button variant="ghost">Mais opções</Button>
        <Button variant="destructive">Excluir</Button>
        <Button variant="destructive-secondary">Excluir conta</Button>
        <Button variant="destructive" disabled>
          Excluir
        </Button>
        <Button variant="ghost" disabled>
          Mais opções
        </Button>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
