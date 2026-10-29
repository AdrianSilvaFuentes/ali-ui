// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox.tsx";

afterEach(cleanup);

// O Radix e o Toggletip do label medem elementos com ResizeObserver, que o jsdom não tem.
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

describe("Checkbox", () => {
  it("é um checkbox com nome, desmarcado por padrão", () => {
    render(<Checkbox label="Aceito os termos" />);
    const checkbox = screen.getByRole("checkbox", { name: "Aceito os termos" });
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });

  it("marca e desmarca no clique, avisando quem usa", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Aceito os termos" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });

  it("clicar no label também marca", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito os termos" />);
    await user.click(screen.getByText("Aceito os termos"));
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("true");
  });

  it("recebe foco pelo Tab e marca com Espaço", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito os termos" />);
    await user.tab();
    const checkbox = screen.getByRole("checkbox");
    expect(document.activeElement).toBe(checkbox);
    await user.keyboard(" ");
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
  });

  it("marcado mostra o check, que se desenha", () => {
    render(<Checkbox label="Aceito os termos" defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    const svg = checkbox.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.querySelector("path")?.getAttribute("class")).toContain("animate-draw");
    expect(checkbox.className).toContain("before:bg-gradient-brand");
    expect(checkbox.className).toContain("data-[state=checked]:before:opacity-100");
    // Hover marcado como o do Button primary: camada mais escura que aparece em fade.
    expect(checkbox.className).toContain("after:bg-gradient-brand-hovered");
    expect(checkbox.className).toContain("data-[state=checked]:hover:after:opacity-100");
  });

  it("indeterminado é anunciado como misto", () => {
    render(<Checkbox label="Selecionar todos" checked="indeterminate" />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed");
  });

  it("com erro, a mensagem de erro substitui a ajuda", () => {
    const { rerender } = render(<Checkbox label="Campo" description="Ajuda." error="Erro." />);
    expect(screen.queryByText("Ajuda.")).toBeNull();
    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Erro.").id,
    );
    rerender(<Checkbox label="Campo" description="Ajuda." />);
    expect(screen.getByText("Ajuda.")).toBeTruthy();
  });

  it("lê a ajuda junto com o checkbox", () => {
    render(<Checkbox label="Newsletter" description="Um email por semana." />);
    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Um email por semana.").id,
    );
  });

  it("com erro, marca como inválido, lê a mensagem e mostra um ícone", () => {
    render(<Checkbox label="Aceito os termos" error="Aceite os termos para continuar." />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.getAttribute("aria-invalid")).toBe("true");
    const message = screen.getByText("Aceite os termos para continuar.");
    expect(checkbox.getAttribute("aria-describedby")).toBe(message.id);
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("desabilitado não marca nem recebe foco, e fica cinza mesmo marcado", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito os termos" disabled defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    await user.tab();
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).not.toBe(checkbox);
    expect(checkbox.className).toContain("bg-disabled");
    expect(checkbox.className).toContain("cursor-not-allowed");
    expect(checkbox.className).not.toContain("bg-gradient-brand");
  });

  it("labelInfo abre a ajuda sem marcar o checkbox", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Newsletter" labelInfo="Pode cancelar quando quiser." />);
    await user.click(screen.getByRole("button", { name: "Mais informações sobre Newsletter" }));
    expect(screen.getByRole("dialog").textContent).toBe("Pode cancelar quando quiser.");
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("false");
  });

  it("caixa de 16px, label label-md e ajuda body-md", () => {
    render(<Checkbox label="Aceito" description="Leia antes." />);
    expect(screen.getByRole("checkbox").className).toContain("size-4");
    expect(screen.getByText("Aceito").className).toContain("text-label-md");
    expect(screen.getByText("Leia antes.").className).toContain("text-body-md");
    expect(screen.getByText("Leia antes.").parentElement?.className).toContain("gap-0.5");
  });

  it("borda suave que escurece no hover e no foco, foco do Button e cursor de clique", () => {
    render(<Checkbox label="Aceito" />);
    const { className } = screen.getByRole("checkbox");
    expect(className).toContain("border-subtle");
    expect(className).toContain("hover:border-default");
    expect(className).toContain("focus-visible:border-default");
    expect(className).toContain("outline-focus");
    expect(className).toContain("focus-visible:outline-2");
    expect(className).toContain("cursor-pointer");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Checkbox label="Aceito os termos" description="Leia antes de aceitar." />
        <Checkbox label="Newsletter" labelInfo="Um email por semana." defaultChecked />
        <Checkbox label="Selecionar todos" checked="indeterminate" />
        <Checkbox label="Obrigatório" error="Marque para continuar." />
        <Checkbox label="Bloqueado" disabled />
        <Checkbox aria-label="Selecionar linha" />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
