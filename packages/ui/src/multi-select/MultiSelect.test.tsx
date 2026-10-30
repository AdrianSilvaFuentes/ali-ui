// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

const interests = [
  { value: "tipografia", label: "Tipografia" },
  { value: "fotografia", label: "Fotografia" },
  { value: "ilustracao", label: "Ilustração", disabled: true },
  { value: "musica", label: "Música" },
];

const many = ["Tipografia", "Fotografia", "Arquitetura", "Cinema", "Viagem", "Culinaria"].map(
  (label) => ({
    value: label.toLowerCase(),
    label,
  }),
);

function Tools(props: Partial<MultiSelectProps>) {
  return (
    <MultiSelect
      label="Interesses"
      placeholder="Escolha seus interesses"
      options={interests}
      {...props}
    />
  );
}

/** Controlado, para ver a tag sumir depois de remover. */
function Controlled() {
  const [value, setValue] = useState(["tipografia", "fotografia"]);
  return <Tools value={value} onValueChange={setValue} />;
}

describe("MultiSelect", () => {
  it("o botão tem o nome do label mais o que está escolhido", () => {
    render(<Tools defaultValue={["tipografia", "fotografia"]} />);
    const trigger = screen.getByRole("button", { name: "Interesses Tipografia, Fotografia" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("o ícone da opção aparece na tag do campo e na da lista, escondido do leitor de tela", async () => {
    const user = userEvent.setup();
    const withIcon = [{ value: "musica", label: "Música", icon: <svg data-testid="icone" /> }];
    render(<Tools options={withIcon} defaultValue={["musica"]} />);
    expect(screen.getAllByTestId("icone")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: /Interesses/ }));
    const icons = screen.getAllByTestId("icone");
    expect(icons).toHaveLength(2);
    for (const icon of icons) expect(icon.closest("[aria-hidden='true']")).toBeTruthy();
    expect(screen.getByRole("option", { name: "Música" })).toBeTruthy();
  });

  it("sem escolha, mostra o placeholder", () => {
    render(<Tools />);
    expect(screen.getByText("Escolha seus interesses")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Interesses Nenhuma opção escolhida" })).toBeTruthy();
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
    expect(onValueChange).toHaveBeenLastCalledWith(["fotografia"]);
    await user.keyboard("{ArrowUp}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["fotografia", "tipografia"]);
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("só a tag recém-escolhida entra com animação", async () => {
    const user = userEvent.setup();
    render(<Tools defaultValue={["tipografia"]} />);
    const tag = (name: string) => within(screen.getByRole("list")).getByText(name).closest("li");
    expect(tag("Tipografia")?.className).not.toContain("animate-pop-in");
    await user.click(screen.getByRole("button", { name: /Interesses/ }));
    await user.click(screen.getByRole("option", { name: "Fotografia" }));
    expect(tag("Fotografia")?.className).toContain("animate-pop-in");
    expect(tag("Tipografia")?.className).not.toContain("animate-pop-in");
  });

  it("a tag removida sai com animação, sem foco nem leitor de tela, e some no fim", async () => {
    const user = userEvent.setup();
    render(<Tools defaultValue={["tipografia", "fotografia"]} />);
    await user.click(screen.getByRole("button", { name: "Remover Tipografia" }));
    const leaving = document.querySelector("li[data-leaving]");
    expect(leaving?.className).toContain("animate-pop-out");
    expect(leaving?.getAttribute("aria-hidden")).toBe("true");
    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(1);
    // O jsdom não tem AnimationEvent, e o React escuta o nome com prefixo.
    if (leaving) fireEvent(leaving, new Event("webkitAnimationEnd", { bubbles: true }));
    expect(document.querySelector("li[data-leaving]")).toBeNull();
  });

  it("as setas pulam a opção desabilitada", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}{ArrowDown}{ArrowDown}");
    const search = screen.getByRole("combobox");
    const musica = screen.getByRole("option", { name: "Música" });
    expect(search.getAttribute("aria-activedescendant")).toBe(musica.id);
    expect(screen.getByRole("option", { name: "Ilustração" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("a escolhida aparece marcada, e um clique tira a escolha", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tools defaultValue={["tipografia"]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: /Interesses/ }));
    const tipografia = screen.getByRole("option", { name: "Tipografia" });
    expect(tipografia.getAttribute("aria-selected")).toBe("true");
    expect(tipografia.className).toContain("bg-selected");
    expect(tipografia.querySelector("svg")?.getAttribute("class")).toContain("text-icon-primary");
    await user.click(tipografia);
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("a busca filtra sem diferença de acentos e avisa quando não acha nada", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("musica");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Música"]);
    await user.keyboard("xyz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toBe("Nenhuma opção encontrada");
  });

  it("Esc fecha, devolve o foco ao campo e limpa a busca", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.tab();
    await user.keyboard("{Enter}tip{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Interesses/ }));
    await user.keyboard("{Enter}");
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  });

  it("o X da tag remove a opção e leva o foco para a próxima tag", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Remover Tipografia" }));
    expect(screen.queryByRole("button", { name: "Remover Tipografia" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Remover Fotografia" }));
    expect(screen.queryByRole("listbox")).toBeNull();
    // Sem mais tags, o foco vai para o botão do campo.
    await user.keyboard("{Delete}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Interesses/ }));
  });

  it("no sm, as tags são md (24px) e cabem no campo e nas opções de 32px", async () => {
    const user = userEvent.setup();
    render(<Tools size="sm" defaultValue={["tipografia"]} />);
    const field = screen.getByRole("list").parentElement;
    expect(field?.className).toContain("min-h-8");
    expect(field?.className).toContain("rounded-lg");
    expect(within(screen.getByRole("list")).getByText("Tipografia").className).toContain("h-6");
    await user.click(screen.getByRole("button", { name: /Interesses/ }));
    expect(screen.getByRole("option", { name: "Tipografia" }).className).toContain("h-8");
  });

  it("fechado, as tags que não cabem viram +N; aberto, aparecem todas", async () => {
    // O jsdom não calcula layout: cada tag tem 80px e 4px de espaço, numa lista de 200px que
    // perde 40px quando o +N aparece.
    const list = (el: Element) => el.tagName === "UL";
    const counterShown = () => document.querySelector("[aria-hidden='true'].shrink-0") !== null;
    const listWidth = () => (counterShown() ? 160 : 200);
    const spies = [
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return list(this) ? listWidth() : 0;
      }),
      vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return list(this) ? this.children.length * 84 - 4 : 0;
      }),
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
        this: Element,
      ) {
        if (list(this)) return { right: listWidth() } as DOMRect;
        const index = [...(this.parentElement?.children ?? [])].indexOf(this);
        return { right: index * 84 + 80 } as DOMRect;
      }),
    ];
    const user = userEvent.setup();
    render(<Tools options={many} defaultValue={many.map((o) => o.value)} />);
    const tags = () => within(screen.getByRole("list")).queryAllByRole("listitem");
    expect(tags()).toHaveLength(1);
    expect(screen.getByText("+5").getAttribute("aria-hidden")).toBe("true");
    // O nome do campo continua com todas.
    expect(screen.getByRole("button", { name: /Interesses/ }).textContent).toContain("Culinaria");
    await user.click(screen.getByRole("button", { name: /Interesses/ }));
    expect(tags()).toHaveLength(6);
    expect(screen.queryByText("+5")).toBeNull();
    for (const spy of spies) spy.mockRestore();
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<Tools description="Até cinco." error="Escolha pelo menos uma." />);
    const trigger = screen.getByRole("button", { name: /Interesses/ });
    expect(screen.queryByText("Até cinco.")).toBeNull();
    expect(trigger.getAttribute("aria-describedby")).toBe(
      screen.getByText("Escolha pelo menos uma.").id,
    );
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
  });

  it("desabilitado não abre e as tags não têm X", async () => {
    const user = userEvent.setup();
    render(<Tools disabled defaultValue={["tipografia"]} />);
    const trigger = screen.getByRole("button", { name: /Interesses/ });
    expect(trigger.hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Remover Tipografia" })).toBeNull();
    await user.click(within(screen.getByRole("list")).getByText("Tipografia"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("não tem problemas de acessibilidade, fechado e aberto", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Tools description="Até cinco." labelInfo="Usadas no seu perfil." />
        <Tools error="Escolha pelo menos uma." defaultValue={["tipografia"]} />
        <Tools disabled />
        <MultiSelect aria-label="Filtrar por interesse" options={interests} />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
    const [first] = screen.getAllByRole("button", { name: "Interesses Nenhuma opção escolhida" });
    if (first) await user.click(first);
    // Aberto, a lista fica num portal, fora do container.
    expect(await violations(screen.getByRole("dialog"))).toEqual([]);
  });
});
