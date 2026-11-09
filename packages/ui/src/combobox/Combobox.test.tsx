// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Combobox, type ComboboxOption } from "./Combobox.tsx";

afterEach(cleanup);

// O balão do Radix e o Toggletip do label medem elementos com ResizeObserver, que o jsdom
// não tem.
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

const countries: ComboboxOption[] = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colômbia" },
  { value: "gi", label: "Gibraltar" },
  { value: "mx", label: "México", disabled: true },
];

const field = () => screen.getByRole("combobox") as HTMLInputElement;
const optionNames = () => screen.queryAllByRole("option").map((o) => o.textContent);

describe("Combobox", () => {
  it("é um combobox com nome, fechado, mostrando a escolhida", () => {
    render(<Combobox label="País" options={countries} defaultValue="cl" />);
    const input = screen.getByRole("combobox", { name: "País" }) as HTMLInputElement;
    expect(input.value).toBe("Chile");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("digitar abre e filtra, sem diferença de acentos", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} />);
    await user.type(field(), "bra");
    expect(field().getAttribute("aria-expanded")).toBe("true");
    expect(optionNames()).toEqual(["Brasil", "Gibraltar"]);
    await user.clear(field());
    await user.type(field(), "colombia");
    expect(optionNames()).toEqual(["Colômbia"]);
  });

  it("setas andam pela lista, pulando as desabilitadas, e Enter escolhe", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="País" options={countries} onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeTruthy();
    // Abre com a primeira em destaque: Argentina. Duas setas: Chile.
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(field().getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Chile" }).id,
    );
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("cl");
    expect(field().value).toBe("Chile");
    expect(screen.queryByRole("listbox")).toBeNull();
    // Reabre na escolhida (Chile). Três setas: Colômbia, Gibraltar e, da última que pode ser
    // escolhida, de volta à primeira. México, desabilitado, fica de fora.
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(field().getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Argentina" }).id,
    );
  });

  it("clique numa opção escolhe e fecha, marcando a escolhida", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} />);
    await user.click(field());
    await user.click(screen.getByRole("option", { name: "Brasil" }));
    expect(field().value).toBe("Brasil");
    expect(document.activeElement).toBe(field());
    await user.click(field());
    expect(screen.getByRole("option", { name: "Brasil" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("o primeiro clique seleciona o texto todo: digitar substitui a escolhida", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} defaultValue="br" />);
    await user.click(field());
    expect(field().selectionStart).toBe(0);
    expect(field().selectionEnd).toBe("Brasil".length);
    await user.keyboard("chi");
    expect(field().value).toBe("chi");
    expect(optionNames()).toEqual(["Chile"]);
  });

  it("só vale o que está na lista: texto solto volta para a escolhida ao sair", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} defaultValue="ar" />);
    await user.clear(field());
    await user.type(field(), "Atlântida");
    expect(screen.getByRole("status").textContent).toBe("Nenhuma opção encontrada");
    await user.tab();
    expect(field().value).toBe("Argentina");
  });

  it("apagar o texto e sair limpa a escolha", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox label="País" options={countries} defaultValue="ar" onValueChange={onValueChange} />,
    );
    await user.clear(field());
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(field().value).toBe("");
  });

  it("Esc fecha e desfaz a busca", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} defaultValue="br" />);
    await user.clear(field());
    await user.type(field(), "chi");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field().value).toBe("Brasil");
  });

  it("envia o value da escolhida com o formulário", () => {
    const { container } = render(
      <form>
        <Combobox label="País" name="country" options={countries} defaultValue="co" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("country")).toBe("co");
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(
      <Combobox label="País" options={countries} description="Ajuda." error="Escolha um país." />,
    );
    expect(screen.queryByText("Ajuda.")).toBeNull();
    const message = screen.getByText("Escolha um país.");
    expect(field().getAttribute("aria-describedby")).toBe(message.id);
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("desabilitado não abre", async () => {
    const user = userEvent.setup();
    render(<Combobox label="País" options={countries} disabled />);
    await user.click(field());
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("não tem problemas de acessibilidade, fechado e aberto", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Combobox label="País" options={countries} description="Onde você mora." />
        <Combobox label="Cidade" labelInfo="A mais perto." options={countries} error="Escolha." />
        <Combobox aria-label="Fuso horário" options={countries} disabled />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
    await user.click(screen.getAllByRole("combobox")[0] as HTMLElement);
    // A lista aberta fica num portal, no fim da página.
    const popup = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(await violations(popup)).toEqual([]);
  });
});
