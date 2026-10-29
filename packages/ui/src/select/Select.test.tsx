// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select, SelectGroup, SelectItem, SelectSeparator } from "./Select.tsx";

afterEach(cleanup);

// O Radix usa APIs de navegador que o jsdom não tem: medir, rolar e capturar o ponteiro.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
Element.prototype.scrollIntoView ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

function Countries(props: Partial<Parameters<typeof Select>[0]>) {
  return (
    <Select label="País" placeholder="Escolha um país" {...props}>
      <SelectItem value="br">Brasil</SelectItem>
      <SelectItem value="pt">Portugal</SelectItem>
      <SelectItem value="mz" disabled>
        Moçambique
      </SelectItem>
    </Select>
  );
}

describe("Select", () => {
  it("o gatilho é um combobox com o nome do label e mostra o placeholder", () => {
    render(<Countries />);
    const trigger = screen.getByRole("combobox", { name: "País" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.textContent).toContain("Escolha um país");
    expect(trigger.hasAttribute("data-placeholder")).toBe(true);
  });

  it("abre pelo teclado, as setas andam e o Enter escolhe", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Countries onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("pt");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("combobox").textContent).toContain("Portugal");
  });

  it("a opção escolhida aparece marcada na lista", async () => {
    const user = userEvent.setup();
    render(<Countries defaultValue="br" />);
    await user.tab();
    await user.keyboard("{Enter}");
    const brasil = screen.getByRole("option", { name: "Brasil" });
    // A lista tem o fundo base (surface), e não o overlay, que no escuro fica mais claro.
    expect(screen.getByRole("listbox").closest("[data-side]")?.className).toContain("bg-surface ");
    expect(brasil.getAttribute("aria-selected")).toBe("true");
    // Escolhida em bg-selected (tom da marca); destaque do mouse e das setas em neutral-hovered.
    expect(brasil.className).toContain("data-[state=checked]:bg-selected");
    expect(brasil.className).toContain("data-highlighted:bg-neutral-hovered");
    const check = brasil.querySelector("svg");
    expect(check?.getAttribute("aria-hidden")).toBe("true");
    expect(check?.getAttribute("class")).toContain("text-icon-primary");
  });

  it("Esc fecha sem mudar a escolha", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Countries defaultValue="br" onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uma opção desabilitada fica marcada como desabilitada", async () => {
    const user = userEvent.setup();
    render(<Countries />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Moçambique" }).hasAttribute("data-disabled")).toBe(
      true,
    );
  });

  it("o gatilho usa a caixa do Input, com a seta que vira ao abrir", () => {
    render(<Countries size="sm" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("h-8");
    expect(trigger.className).toContain("rounded-lg");
    expect(trigger.className).toContain("border-subtle");
    expect(trigger.className).toContain("cursor-pointer");
    expect(trigger.querySelector("svg")?.getAttribute("class")).toContain(
      "group-data-[state=open]:rotate-180",
    );
  });

  it("no sm, as opções de uma linha têm 32px, a altura do gatilho", async () => {
    const user = userEvent.setup();
    render(<Countries size="sm" />);
    await user.tab();
    await user.keyboard("{Enter}");
    const option = screen.getByRole("option", { name: "Brasil" });
    expect(option.className).toContain("min-h-8");
    expect(option.className).toContain("items-center");
  });

  it("no md, as opções mantêm o respiro maior", async () => {
    const user = userEvent.setup();
    render(<Countries />);
    await user.tab();
    await user.keyboard("{Enter}");
    const option = screen.getByRole("option", { name: "Brasil" });
    expect(option.className).toContain("py-2");
    expect(option.className).not.toContain("min-h-8");
  });

  it("lê a ajuda junto com o campo", () => {
    render(<Countries description="Onde você mora hoje." />);
    expect(screen.getByRole("combobox").getAttribute("aria-describedby")).toBe(
      screen.getByText("Onde você mora hoje.").id,
    );
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<Countries description="Onde você mora hoje." error="Escolha um país." />);
    const trigger = screen.getByRole("combobox");
    expect(screen.queryByText("Onde você mora hoje.")).toBeNull();
    expect(trigger.getAttribute("aria-describedby")).toBe(screen.getByText("Escolha um país.").id);
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(trigger.hasAttribute("data-invalid")).toBe(true);
  });

  it("desabilitado não abre nem recebe foco", async () => {
    const user = userEvent.setup();
    render(<Countries disabled />);
    const trigger = screen.getByRole("combobox");
    await user.tab();
    expect(document.activeElement).not.toBe(trigger);
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opção com ícone, segunda linha e tag: o gatilho mostra só o ícone e o nome", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Responsável" defaultValue="lia">
        <SelectItem
          value="lia"
          leading={<svg data-testid="avatar" />}
          description="lia@exemplo.com"
          trailing={<span>Admin</span>}
        >
          Lia
        </SelectItem>
      </Select>,
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger.textContent).toContain("Lia");
    expect(trigger.textContent).not.toContain("lia@exemplo.com");
    expect(trigger.textContent).not.toContain("Admin");
    expect(trigger.querySelector("[data-slot=select-value] svg")).toBeTruthy();
    await user.tab();
    await user.keyboard("{Enter}");
    const option = screen.getByRole("option", { name: /Lia/ });
    expect(option.textContent).toContain("lia@exemplo.com");
    expect(screen.getByText("lia@exemplo.com").className).toContain("text-body-sm");
    expect(option.textContent).toContain("Admin");
  });

  it("grupos têm título e uma linha decorativa entre eles", async () => {
    const user = userEvent.setup();
    render(
      <Select label="Entrega">
        <SelectGroup label="Em casa">
          <SelectItem value="padrao">Padrão</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup label="Retirar">
          <SelectItem value="loja">Na loja</SelectItem>
        </SelectGroup>
      </Select>,
    );
    await user.tab();
    await user.keyboard("{Enter}");
    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);
    expect(groups[0]?.getAttribute("aria-labelledby")).toBeTruthy();
    const title = screen.getByText("Em casa");
    expect(title.className).toContain("text-label-md");
    expect(title.className).toContain("text-subtle");
    // O separador é só visual: escondido do leitor de tela, que já ouve os títulos dos grupos.
    const separator = document.querySelector(".border-t.border-subtle");
    expect(separator?.getAttribute("aria-hidden")).toBe("true");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Countries description="Onde você mora hoje." labelInfo="Usado no frete." />
        <Countries error="Escolha um país." />
        <Countries disabled />
        <Select aria-label="Ordenar por" placeholder="Ordenar">
          <SelectItem value="recentes">Mais recentes</SelectItem>
        </Select>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
