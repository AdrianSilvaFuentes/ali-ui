// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "./NumberInput.tsx";

afterEach(cleanup);

// O Toggletip do label mede elementos com ResizeObserver, que o jsdom não tem.
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

const field = () => screen.getByRole("spinbutton") as HTMLInputElement;

describe("NumberInput", () => {
  it("é um spinbutton com nome, valor e limites", () => {
    render(<NumberInput label="Pessoas" defaultValue={3} min={1} max={10} />);
    const input = screen.getByRole("spinbutton", { name: "Pessoas" });
    expect((input as HTMLInputElement).value).toBe("3");
    expect(input.getAttribute("aria-valuenow")).toBe("3");
    expect(input.getAttribute("aria-valuemin")).toBe("1");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
  });

  it("os botões − e + somam um passo e avisam quem usa", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Pessoas" defaultValue={3} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(field().value).toBe("4");
    expect(onValueChange).toHaveBeenLastCalledWith(4);
    await user.click(screen.getByRole("button", { name: "Diminuir" }));
    await user.click(screen.getByRole("button", { name: "Diminuir" }));
    expect(field().value).toBe("2");
  });

  it("os botões param nos limites e ficam desabilitados", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Pessoas" defaultValue={2} min={1} max={3} />);
    await user.click(screen.getByRole("button", { name: "Diminuir" }));
    expect(field().value).toBe("1");
    expect(screen.getByRole("button", { name: "Diminuir" }).hasAttribute("disabled")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(field().value).toBe("3");
    expect(screen.getByRole("button", { name: "Aumentar" }).hasAttribute("disabled")).toBe(true);
  });

  it("pelo teclado: setas, Page Up e Page Down, Home e End", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Dias" defaultValue={5} min={0} max={30} />);
    await user.tab();
    expect(document.activeElement).toBe(field());
    await user.keyboard("{ArrowUp}");
    expect(field().value).toBe("6");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(field().value).toBe("4");
    await user.keyboard("{PageUp}");
    expect(field().value).toBe("14");
    await user.keyboard("{End}");
    expect(field().value).toBe("30");
    await user.keyboard("{Home}");
    expect(field().value).toBe("0");
  });

  it("os botões ficam fora do Tab: o próximo Tab sai do campo", async () => {
    const user = userEvent.setup();
    render(
      <>
        <NumberInput label="Dias" defaultValue={5} />
        <button type="button">Depois</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Depois" }));
  });

  it("aceita vírgula, soma decimais sem erro de conta e limita ao sair do campo", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput label="Peso" step={0.1} max={2} onValueChange={onValueChange} />);
    await user.type(field(), "0,2");
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(0.2);
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(field().value).toBe("0,3");
    await user.clear(field());
    await user.type(field(), "9");
    await user.tab();
    expect(field().value).toBe("2");
  });

  it("texto que não é número volta a ficar vazio", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Dias" />);
    await user.type(field(), "abc");
    await user.tab();
    expect(field().value).toBe("");
  });

  it("envia o número com o formulário", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <NumberInput label="Peso" name="weight" defaultValue={1.5} step={0.5} />
      </form>,
    );
    expect(field().value).toBe("1,5");
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("weight")).toBe("2");
  });

  it("controlado, mostra o valor que vem de fora", () => {
    render(<NumberInput label="Dias" value={12} />);
    expect(field().value).toBe("12");
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<NumberInput label="Dias" description="Ajuda." error="Escolha até 30 dias." />);
    expect(screen.queryByText("Ajuda.")).toBeNull();
    const message = screen.getByText("Escolha até 30 dias.");
    expect(field().getAttribute("aria-describedby")).toBe(message.id);
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("desabilitado não muda e os botões ficam desabilitados", async () => {
    const user = userEvent.setup();
    render(<NumberInput label="Dias" defaultValue={5} disabled />);
    await user.click(screen.getByRole("button", { name: "Aumentar" }));
    expect(field().value).toBe("5");
    expect(screen.getByRole("button", { name: "Diminuir" }).hasAttribute("disabled")).toBe(true);
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <NumberInput label="Pessoas" defaultValue={3} min={1} description="Até 10." />
        <NumberInput label="Dias" labelInfo="Corridos." error="Escolha até 30 dias." />
        <NumberInput label="Bloqueado" defaultValue={2} disabled />
        <NumberInput aria-label="Quantidade" defaultValue={1} size="sm" />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
