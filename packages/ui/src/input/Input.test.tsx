// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./Input.tsx";

afterEach(cleanup);

// O Toggletip do label mede o próprio tail com ResizeObserver, que o jsdom não tem.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

/** A caixa visível do campo, que leva foco, erro e desabilitado. */
function box(input: HTMLElement) {
  return input.parentElement as HTMLElement;
}

describe("Input", () => {
  it("liga o label ao campo", () => {
    render(<Input label="Email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeTruthy();
  });

  it("clicar no label foca o campo", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    await user.click(screen.getByText("Email"));
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("cursor de texto na caixa toda, e clicar no ícone foca o campo", async () => {
    const user = userEvent.setup();
    render(<Input label="Buscar" iconLeft={<svg data-testid="icon" />} />);
    const input = screen.getByRole("textbox");
    expect(box(input).className).toContain("cursor-text");
    await user.click(screen.getByTestId("icon"));
    expect(document.activeElement).toBe(input);
  });

  it("desabilitado, clicar na caixa não foca o campo", async () => {
    const user = userEvent.setup();
    render(<Input label="Buscar" disabled iconLeft={<svg data-testid="icon" />} />);
    await user.click(screen.getByTestId("icon"));
    expect(document.activeElement).not.toBe(screen.getByRole("textbox"));
  });

  it("aceita digitação e recebe foco pelo Tab", async () => {
    const user = userEvent.setup();
    render(<Input label="Nome" />);
    await user.tab();
    const input = screen.getByRole("textbox");
    expect(document.activeElement).toBe(input);
    await user.keyboard("Ali");
    expect((input as HTMLInputElement).value).toBe("Ali");
  });

  it("labelInfo põe um ícone de info no fim do label, que abre a ajuda", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" labelInfo="Só para avisos." />);
    const field = screen.getByRole("textbox", { name: "Email" });
    const info = screen.getByRole("button", { name: "Mais informações sobre Email" });
    expect(info.closest("label")).toBeNull();
    await user.click(info);
    expect(screen.getByRole("dialog").textContent).toBe("Só para avisos.");
    expect(document.activeElement).not.toBe(field);
  });

  it("sem labelInfo, não há ícone de info", () => {
    render(<Input label="Email" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("ajuda e erro em body-md", () => {
    const { rerender } = render(<Input label="Campo" description="Ajuda." />);
    expect(screen.getByText("Ajuda.").className).toContain("text-body-md");
    rerender(<Input label="Campo" error="Erro." />);
    expect(screen.getByText("Erro.").className).toContain("text-body-md");
  });

  it("com erro, a mensagem de erro substitui a ajuda", () => {
    const { rerender } = render(<Input label="Campo" description="Ajuda." error="Erro." />);
    expect(screen.queryByText("Ajuda.")).toBeNull();
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Erro.").id,
    );
    rerender(<Input label="Campo" description="Ajuda." />);
    expect(screen.getByText("Ajuda.")).toBeTruthy();
  });

  it("lê a ajuda junto com o campo", () => {
    render(<Input label="Email" description="Usamos só para avisos." />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-describedby")).toBe(
      screen.getByText("Usamos só para avisos.").id,
    );
  });

  it("com erro, marca o campo como inválido, lê a mensagem e mostra um ícone", () => {
    render(<Input label="Email" error="Falta o domínio." />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const message = screen.getByText("Falta o domínio.");
    expect(describedBy).toContain(message.id);
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(box(input).hasAttribute("data-invalid")).toBe(true);
  });

  it("sem erro, não marca o campo como inválido", () => {
    render(<Input label="Email" />);
    const input = screen.getByRole("textbox");
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("aria-describedby")).toBe(false);
  });

  it("mantém o aria-describedby passado por fora", () => {
    render(<Input label="Senha" description="Mínimo de 8 letras." aria-describedby="dica" />);
    const describedBy = screen.getByLabelText("Senha").getAttribute("aria-describedby");
    expect(describedBy?.split(" ")[0]).toBe("dica");
  });

  it("desabilitado não recebe foco nem texto", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" disabled />);
    const input = screen.getByRole("textbox");
    await user.tab();
    expect(document.activeElement).not.toBe(input);
    expect(box(input).hasAttribute("data-disabled")).toBe(true);
  });

  it("somente leitura mostra a seta, não o cursor de texto nem o de proibido", () => {
    render(<Input label="Notas" readOnly defaultValue="Pro" />);
    const field = screen.getByRole("textbox");
    expect(field.className).toContain("cursor-default");
    expect(box(field).className).toContain("data-readonly:cursor-default");
  });

  it("somente leitura recebe foco, não aceita texto e ganha o fundo próprio", async () => {
    const user = userEvent.setup();
    render(<Input label="Plano" readOnly defaultValue="Pro" />);
    const input = screen.getByRole("textbox", { name: "Plano" }) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.keyboard("X");
    expect(input.value).toBe("Pro");
    const { className } = box(input);
    expect(box(input).hasAttribute("data-readonly")).toBe(true);
    expect(className).toContain("data-readonly:bg-readonly");
  });

  it("os ícones ficam escondidos do leitor de tela", () => {
    render(
      <Input
        label="Buscar"
        iconLeft={<svg data-testid="left" />}
        iconRight={<svg data-testid="right" />}
      />,
    );
    expect(screen.getByTestId("left").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("right").parentElement?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("textbox", { name: "Buscar" })).toBeTruthy();
  });

  it.each([
    ["sm", "h-8", "rounded-lg"],
    ["md", "h-10", "rounded-xl"],
  ] as const)("tamanho %s usa a altura %s e o raio %s, como o Button", (size, height, radius) => {
    render(<Input label="Email" size={size} />);
    const { className } = box(screen.getByRole("textbox"));
    expect(className).toContain(height);
    expect(className).toContain(radius);
  });

  it("borda suave em repouso, que escurece no hover e no foco", () => {
    render(<Input label="Email" />);
    const { className } = box(screen.getByRole("textbox"));
    expect(className).toContain("border-subtle");
    expect(className).toContain("shadow-sm");
    expect(className).not.toContain("inset-shadow-highlight");
    expect(className).toContain("hover:border-default");
    expect(className).toContain("focus-within:border-default");
  });

  it("o placeholder usa a cor própria, mais clara que o texto digitado", () => {
    render(<Input label="Email" placeholder="voce@exemplo.com" />);
    expect(screen.getByRole("textbox").className).toContain("placeholder:text-placeholder");
  });

  it("mostra o foco na caixa, na cor de foco", () => {
    render(<Input label="Email" />);
    const { className } = box(screen.getByRole("textbox"));
    expect(className).toContain("outline-focus");
    expect(className).toContain("focus-within:outline-2");
    expect(className).toContain("motion-reduce:outline-offset-2");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Input label="Email" description="Usamos só para avisos." />
        <Input label="Nome" labelInfo="Como aparece no perfil." />
        <Input label="Senha" type="password" error="Senha muito curta." />
        <Input aria-label="Buscar" placeholder="Buscar" />
        <Input label="Empresa" disabled />
        <Input label="Plano" readOnly defaultValue="Pro" />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
