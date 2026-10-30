// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MultiSelect, type MultiSelectProps } from "./MultiSelect.tsx";

afterEach(cleanup);

// O Radix usa APIs de navegador que o jsdom não tem: medir e rolar.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
Element.prototype.scrollIntoView ??= () => {};

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

const tools = [
  { value: "figma", label: "Figma" },
  { value: "sketch", label: "Sketch" },
  { value: "invision", label: "InVision", disabled: true },
  { value: "edicao", label: "Edição" },
];

function Tools(props: Partial<MultiSelectProps>) {
  return (
    <MultiSelect
      label="Ferramentas"
      placeholder="Escolha as ferramentas"
      options={tools}
      {...props}
    />
  );
}

/** Controlado, para ver a tag sumir depois de remover. */
function Controlled() {
  const [value, setValue] = useState(["figma", "sketch"]);
  return <Tools value={value} onValueChange={setValue} />;
}

describe("MultiSelect", () => {
  it("o botão tem o nome do label mais o que está escolhido", () => {
    render(<Tools defaultValue={["figma", "sketch"]} />);
    const trigger = screen.getByRole("button", { name: "Ferramentas Figma, Sketch" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("sem escolha, mostra o placeholder", () => {
    render(<Tools />);
    expect(screen.getByText("Escolha as ferramentas")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Ferramentas Nenhuma opção escolhida" }),
    ).toBeTruthy();
  });

  it("abre pelo teclado com o foco na busca, e Enter escolhe sem fechar", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tools onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{Enter}");
    const search = screen.getByRole("combobox", { name: "Buscar opção" });
    expect(document.activeElement).toBe(search);
    expect(screen.getByRole("listbox").getAttribute("aria-multiselectable")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["sketch"]);
    await user.keyboard("{ArrowUp}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["sketch", "figma"]);
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("as setas pulam a opção desabilitada", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}{ArrowDown}{ArrowDown}");
    const search = screen.getByRole("combobox");
    const edicao = screen.getByRole("option", { name: "Edição" });
    expect(search.getAttribute("aria-activedescendant")).toBe(edicao.id);
    expect(screen.getByRole("option", { name: "InVision" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("a escolhida aparece marcada, e um clique tira a escolha", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tools defaultValue={["figma"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Ferramentas/ }));
    const figma = screen.getByRole("option", { name: "Figma" });
    expect(figma.getAttribute("aria-selected")).toBe("true");
    expect(figma.className).toContain("bg-selected");
    expect(figma.querySelector("svg")?.getAttribute("class")).toContain("text-icon-primary");
    await user.click(figma);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("a busca filtra sem diferença de acentos e avisa quando não acha nada", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("edicao");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Edição"]);
    await user.keyboard("xyz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toBe("Nenhuma opção encontrada");
  });

  it("Esc fecha, devolve o foco ao campo e limpa a busca", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}fig{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Ferramentas/ }));
    await user.keyboard("{Enter}");
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  });

  it("o X da tag remove a opção e leva o foco para a próxima tag", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Remover Figma" }));
    expect(screen.queryByRole("button", { name: "Remover Figma" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Remover Sketch" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    // Sem mais tags, o foco vai para o botão do campo.
    await user.keyboard("{Delete}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Ferramentas/ }));
  });

  it("no sm, as tags e as opções acompanham o campo de 32px", async () => {
    const user = userEvent.setup();
    render(<Tools size="sm" defaultValue={["figma"]} />);
    const field = screen.getByRole("list").parentElement;
    expect(field?.className).toContain("min-h-8");
    expect(field?.className).toContain("rounded-lg");
    expect(within(screen.getByRole("list")).getByText("Figma").className).toContain("h-5");
    await user.click(screen.getByRole("button", { name: /Ferramentas/ }));
    expect(screen.getByRole("option", { name: "Figma" }).className).toContain("h-8");
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<Tools description="Até cinco." error="Escolha pelo menos uma." />);
    const trigger = screen.getByRole("button", { name: /Ferramentas/ });
    expect(screen.queryByText("Até cinco.")).toBeNull();
    expect(trigger.getAttribute("aria-describedby")).toBe(
      screen.getByText("Escolha pelo menos uma.").id,
    );
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
  });

  it("desabilitado não abre e as tags não têm X", async () => {
    const user = userEvent.setup();
    render(<Tools disabled defaultValue={["figma"]} />);
    const trigger = screen.getByRole("button", { name: /Ferramentas/ });
    expect(trigger.hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Remover Figma" })).toBeNull();
    await user.click(within(screen.getByRole("list")).getByText("Figma"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("não tem problemas de acessibilidade, fechado e aberto", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Tools description="Até cinco." labelInfo="Usadas no seu perfil." />
        <Tools error="Escolha pelo menos uma." defaultValue={["figma"]} />
        <Tools disabled />
        <MultiSelect aria-label="Filtrar por ferramenta" options={tools} />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
    const [first] = screen.getAllByRole("button", { name: "Ferramentas Nenhuma opção escolhida" });
    if (first) await user.click(first);
    // Aberto, a lista fica num portal, fora do container.
    expect(await violations(screen.getByRole("dialog"))).toEqual([]);
  });
});
