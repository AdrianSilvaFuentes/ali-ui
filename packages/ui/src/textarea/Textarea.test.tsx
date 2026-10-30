// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Textarea } from "./Textarea.tsx";

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
function box(textarea: HTMLElement) {
  return textarea.parentElement as HTMLElement;
}

describe("Textarea", () => {
  it("liga o label ao campo", () => {
    render(<Textarea label="Mensagem" />);
    expect(screen.getByRole("textbox", { name: "Mensagem" })).toBeTruthy();
  });

  it("clicar no label foca o campo", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" />);
    await user.click(screen.getByText("Mensagem"));
    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("cursor de texto na caixa toda, e clicar no respiro foca o campo", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" />);
    const textarea = screen.getByRole("textbox");
    expect(box(textarea).className).toContain("cursor-text");
    await user.click(box(textarea));
    expect(document.activeElement).toBe(textarea);
  });

  it("desabilitado, clicar na caixa não foca o campo", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" disabled />);
    const textarea = screen.getByRole("textbox");
    await user.click(box(textarea));
    expect(document.activeElement).not.toBe(textarea);
  });

  it("aceita várias linhas e recebe foco pelo Tab", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" />);
    await user.tab();
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(document.activeElement).toBe(textarea);
    await user.keyboard("Oi{Enter}Tudo bem?");
    expect(textarea.value).toBe("Oi\nTudo bem?");
  });

  it("começa com 3 linhas e aceita outra altura", () => {
    const { rerender } = render(<Textarea label="Mensagem" />);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).rows).toBe(3);
    rerender(<Textarea label="Mensagem" rows={6} />);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).rows).toBe(6);
  });

  it("labelInfo põe um ícone de info no fim do label, que abre a ajuda", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" labelInfo="Só para avisos." />);
    const field = screen.getByRole("textbox", { name: "Mensagem" });
    const info = screen.getByRole("button", { name: "Mais informações sobre Mensagem" });
    expect(info.closest("label")).toBeNull();
    await user.click(info);
    expect(screen.getByRole("dialog").textContent).toBe("Só para avisos.");
    expect(document.activeElement).not.toBe(field);
  });

  it("sem labelInfo, não há ícone de info", () => {
    render(<Textarea label="Mensagem" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("ajuda e erro em body-md", () => {
    const { rerender } = render(<Textarea label="Campo" description="Ajuda." />);
    expect(screen.getByText("Ajuda.").className).toContain("text-body-md");
    rerender(<Textarea label="Campo" error="Erro." />);
    expect(screen.getByText("Erro.").className).toContain("text-body-md");
  });

  it("com erro, a mensagem de erro substitui a ajuda", () => {
    const { rerender } = render(<Textarea label="Campo" description="Ajuda." error="Erro." />);
    expect(screen.queryByText("Ajuda.")).toBeNull();
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Erro.").id,
    );
    rerender(<Textarea label="Campo" description="Ajuda." />);
    expect(screen.getByText("Ajuda.")).toBeTruthy();
  });

  it("lê a ajuda junto com o campo", () => {
    render(<Textarea label="Mensagem" description="Respondemos em dois dias." />);
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Respondemos em dois dias.").id,
    );
  });

  it("com erro, marca o campo como inválido, lê a mensagem e mostra um ícone", () => {
    render(<Textarea label="Mensagem" error="Texto muito curto." />);
    const textarea = screen.getByRole("textbox", { name: "Mensagem" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    const describedBy = textarea.getAttribute("aria-describedby")?.split(" ") ?? [];
    const message = screen.getByText("Texto muito curto.");
    expect(describedBy).toContain(message.id);
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(box(textarea).hasAttribute("data-invalid")).toBe(true);
  });

  it("sem erro, não marca o campo como inválido", () => {
    render(<Textarea label="Mensagem" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.hasAttribute("aria-invalid")).toBe(false);
    expect(textarea.hasAttribute("aria-describedby")).toBe(false);
  });

  it("mantém o aria-describedby passado por fora", () => {
    render(<Textarea label="Bio" description="Até 200 letras." aria-describedby="dica" />);
    const describedBy = screen.getByLabelText("Bio").getAttribute("aria-describedby");
    expect(describedBy?.split(" ")[0]).toBe("dica");
  });

  it("desabilitado não recebe foco e não redimensiona", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Mensagem" disabled />);
    const textarea = screen.getByRole("textbox");
    await user.tab();
    expect(document.activeElement).not.toBe(textarea);
    expect(box(textarea).hasAttribute("data-disabled")).toBe(true);
    expect(textarea.className).toContain("disabled:resize-none");
  });

  it("somente leitura mostra a seta, não o cursor de texto nem o de proibido", () => {
    render(<Textarea label="Notas" readOnly defaultValue="Ligar antes." />);
    const field = screen.getByRole("textbox");
    expect(field.className).toContain("cursor-default");
    expect(box(field).className).toContain("data-readonly:cursor-default");
  });

  it("somente leitura recebe foco, não aceita texto e ganha o fundo próprio", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Notas" readOnly defaultValue="Ligar antes." />);
    const textarea = screen.getByRole("textbox", { name: "Notas" }) as HTMLTextAreaElement;
    expect(textarea.readOnly).toBe(true);
    await user.tab();
    expect(document.activeElement).toBe(textarea);
    await user.keyboard("X");
    expect(textarea.value).toBe("Ligar antes.");
    expect(box(textarea).hasAttribute("data-readonly")).toBe(true);
    expect(box(textarea).className).toContain("data-readonly:bg-readonly");
  });

  it("estica só na vertical", () => {
    render(<Textarea label="Mensagem" />);
    expect(screen.getByRole("textbox").className).toContain("resize-y");
  });

  it("o texto escondido some num degradê, não num corte reto", () => {
    render(<Textarea label="Mensagem" />);
    expect(screen.getByRole("textbox").className).toContain("scroll-fade-y");
  });

  it("barra de rolagem fina, na cor da borda", () => {
    render(<Textarea label="Mensagem" />);
    const { className } = screen.getByRole("textbox");
    expect(className).toContain("[scrollbar-width:thin]");
    expect(className).toContain("[scrollbar-color:var(--ali-color-border-default)_transparent]");
  });

  it.each([
    ["sm", "rounded-lg"],
    ["md", "rounded-xl"],
  ] as const)("tamanho %s usa o raio %s, como o Input", (size, radius) => {
    render(<Textarea label="Mensagem" size={size} />);
    expect(box(screen.getByRole("textbox")).className).toContain(radius);
  });

  it("mesma borda, sombra e foco do Input, na caixa", () => {
    render(<Textarea label="Mensagem" />);
    const textarea = screen.getByRole("textbox");
    const { className } = box(textarea);
    expect(className).toContain("border-subtle");
    expect(className).toContain("shadow-xs");
    expect(className).toContain("hover:border-default");
    expect(className).toContain("focus-within:border-default");
    expect(className).toContain("outline-focus");
    expect(className).toContain("focus-within:outline-2");
    expect(className).toContain("motion-reduce:outline-offset-2");
    expect(textarea.className).toContain("placeholder:text-placeholder");
  });

  it.each([
    ["sm", "[&>textarea]:py-0.5"],
    ["md", "[&>textarea]:py-1.5"],
  ] as const)(
    "tamanho %s: a caixa tem 4px de respiro e a textarea completa com %s",
    (size, inner) => {
      render(<Textarea label="Mensagem" size={size} />);
      const { className } = box(screen.getByRole("textbox"));
      expect(className).toContain("py-1");
      expect(className).toContain("pr-1");
      expect(className).toContain(inner);
    },
  );

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Textarea label="Mensagem" description="Respondemos em dois dias." />
        <Textarea label="Resumo" labelInfo="Aparece no topo do perfil." />
        <Textarea label="Bio" error="Texto muito curto." />
        <Textarea aria-label="Responder" placeholder="Escreva uma resposta" />
        <Textarea label="Motivo" disabled />
        <Textarea label="Notas" readOnly defaultValue="Ligar antes." />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
