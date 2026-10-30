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

/** Com criação: as opções criadas entram na lista, guardadas aqui fora. */
function Creatable({ onValueChange }: { onValueChange?: (value: string[]) => void }) {
  const [options, setOptions] = useState(interests);
  const [value, setValue] = useState<string[]>([]);
  return (
    <Tools
      options={options}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      onCreate={(label) => {
        const option = { value: label.toLowerCase(), label };
        setOptions((list) => [...list, option]);
        return option;
      }}
    />
  );
}

/** Três escolhidas, controlado, para ver a ordem mudar. */
function Ordered({ onValueChange }: { onValueChange: (value: string[]) => void }) {
  const [value, setValue] = useState(["tipografia", "fotografia", "musica"]);
  return (
    <Tools
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
      onOptionsReorder={() => {}}
    />
  );
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
    expect(screen.getByText("Nenhuma opção encontrada").getAttribute("role")).toBe("status");
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

  it("Enter num texto novo cria a opção, escolhe e limpa a busca", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Creatable onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("Design");
    const create = screen.getByRole("option", { name: "Criar “Design”" });
    expect(
      screen.getByRole("combobox", { name: "Buscar opção" }).getAttribute("aria-activedescendant"),
    ).toBe(create.id);
    expect(screen.queryByText("Nenhuma opção encontrada")).toBeNull();
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["design"]);
    expect(screen.getByRole("combobox", { name: "Buscar opção" })).toHaveProperty("value", "");
    expect(screen.getByRole("option", { name: "Design" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("não oferece criar um nome que já existe, nem sem onCreate", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Creatable />);
    await user.click(screen.getByRole("button"));
    await user.keyboard("musica");
    expect(screen.queryByRole("option", { name: /Criar/ })).toBeNull();
    // Com parecidas, a primeira fica em destaque e a de criar fica no fim, pelas setas.
    await user.clear(screen.getByRole("combobox"));
    await user.keyboard("Tipo{ArrowDown}{Enter}");
    expect(screen.getByRole("option", { name: "Tipo" }).getAttribute("aria-selected")).toBe("true");
    unmount();
    render(<Tools />);
    await user.click(screen.getByRole("button"));
    await user.keyboard("Design");
    expect(screen.queryByRole("option", { name: /Criar/ })).toBeNull();
    expect(screen.getByText("Nenhuma opção encontrada")).toBeTruthy();
  });

  it("Alt+setas no X movem a tag, o foco vai junto e o leitor de tela ouve o lugar novo", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Ordered onValueChange={onValueChange} />);
    screen.getByRole("button", { name: "Remover Tipografia" }).focus();
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(onValueChange).toHaveBeenLastCalledWith(["fotografia", "tipografia", "musica"]);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Remover Tipografia" }));
    expect(screen.getByText("Tipografia, posição 2 de 3").getAttribute("role")).toBe("status");
    // No começo, Alt+← não faz nada.
    screen.getByRole("button", { name: "Remover Fotografia" }).focus();
    onValueChange.mockClear();
    await user.keyboard("{Alt>}{ArrowLeft}{/Alt}");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("sem onOptionsReorder, as tags não se reordenam", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tools defaultValue={["tipografia", "fotografia"]} onValueChange={onValueChange} />);
    screen.getByRole("button", { name: "Remover Tipografia" }).focus();
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText("Tipografia").closest("[data-reorder]")).toBeNull();
  });

  it("com onOptionsReorder, Alt+setas movem a opção em destaque e as tags seguem; com busca, não", async () => {
    const user = userEvent.setup();
    const onOptionsReorder = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Tools
        onOptionsReorder={onOptionsReorder}
        defaultValue={["tipografia", "fotografia"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: /^Interesses/ }));
    await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
    // As tags seguem a ordem nova da lista.
    expect(onValueChange).toHaveBeenLastCalledWith(["fotografia", "tipografia"]);
    expect(onOptionsReorder.mock.calls[0]?.[0].map((o: { value: string }) => o.value)).toEqual([
      "fotografia",
      "tipografia",
      "ilustracao",
      "musica",
    ]);
    expect(screen.getByText("Tipografia, posição 2 de 4")).toBeTruthy();
    await user.keyboard("fo{Alt>}{ArrowDown}{/Alt}");
    expect(onOptionsReorder).toHaveBeenCalledTimes(1);
  });

  it("com onOptionsReorder, mover a tag move a opção na lista, e a escolha nova entra no lugar dela", async () => {
    const user = userEvent.setup();
    const onOptionsReorder = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Tools
        onOptionsReorder={onOptionsReorder}
        defaultValue={["tipografia", "musica"]}
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole("button", { name: "Remover Tipografia" }).focus();
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(onValueChange).toHaveBeenLastCalledWith(["musica", "tipografia"]);
    // As escolhidas trocam de lugar entre si; as outras ficam onde estão.
    expect(onOptionsReorder.mock.calls[0]?.[0].map((o: { value: string }) => o.value)).toEqual([
      "musica",
      "fotografia",
      "ilustracao",
      "tipografia",
    ]);
    await user.click(screen.getByRole("button", { name: /^Interesses/ }));
    await user.click(screen.getByRole("option", { name: "Fotografia" }));
    // A lista do teste não guardou a ordem nova: Fotografia entra entre Tipografia e Música.
    expect(onValueChange).toHaveBeenLastCalledWith(["tipografia", "fotografia", "musica"]);
  });

  it("arrastar uma opção a leva para onde o mouse soltar, sem escolher", async () => {
    const user = userEvent.setup();
    const onOptionsReorder = vi.fn();
    const onValueChange = vi.fn();
    render(<Tools onOptionsReorder={onOptionsReorder} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button"));
    // O jsdom não mede: cada opção tem 40px de altura, uma embaixo da outra.
    const rows = screen.getAllByRole("option");
    rows.forEach((row, i) => {
      row.getBoundingClientRect = () =>
        ({ top: i * 40, bottom: i * 40 + 40, height: 40, left: 0, width: 200 }) as DOMRect;
    });
    const first = rows[0] as HTMLElement;
    fireEvent.pointerDown(first, { button: 0, clientX: 10, clientY: 20 });
    fireEvent.pointerMove(window, { clientX: 10, clientY: 105 });
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Fotografia",
      "Ilustração",
      "Tipografia",
      "Música",
    ]);
    fireEvent.pointerUp(window, { clientX: 10, clientY: 105 });
    fireEvent.click(first);
    expect(onOptionsReorder.mock.calls[0]?.[0].map((o: { value: string }) => o.value)).toEqual([
      "fotografia",
      "ilustracao",
      "tipografia",
      "musica",
    ]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("a lista rola com a barra fina do Textarea", async () => {
    const user = userEvent.setup();
    render(<Tools />);
    await user.click(screen.getByRole("button", { name: /^Interesses/ }));
    const className = screen.getByRole("listbox").className;
    expect(className).toContain("overflow-y-auto");
    expect(className).toContain("[scrollbar-width:thin]");
    expect(className).toContain("[scrollbar-color:var(--ali-color-border-default)_transparent]");
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
