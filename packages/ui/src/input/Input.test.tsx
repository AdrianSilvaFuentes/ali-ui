// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./Input.tsx";

afterEach(cleanup);

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

  it("aceita digitação e recebe foco pelo Tab", async () => {
    const user = userEvent.setup();
    render(<Input label="Nome" />);
    await user.tab();
    const input = screen.getByRole("textbox");
    expect(document.activeElement).toBe(input);
    await user.keyboard("Ali");
    expect((input as HTMLInputElement).value).toBe("Ali");
  });

  it("lê a ajuda junto com o campo", () => {
    render(<Input label="Email" description="Usamos só para avisos." />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-describedby")).toBe(
      screen.getByText("Usamos só para avisos.").id,
    );
  });

  it("com erro, marca o campo como inválido, lê a mensagem e mostra um ícone", () => {
    render(<Input label="Email" description="Seu email." error="Falta o domínio." />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const message = screen.getByText("Falta o domínio.");
    expect(describedBy).toContain(message.id);
    expect(describedBy).toContain(screen.getByText("Seu email.").id);
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
        <Input label="Senha" type="password" error="Senha muito curta." />
        <Input aria-label="Buscar" placeholder="Buscar" />
        <Input label="Empresa" disabled />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
