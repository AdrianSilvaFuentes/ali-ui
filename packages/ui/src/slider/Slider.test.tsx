// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider.tsx";

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

describe("Slider", () => {
  it("é um slider com o nome do label e o valor inicial", () => {
    render(<Slider label="Volume" defaultValue={[40]} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("40");
    expect(thumb.getAttribute("aria-valuemin")).toBe("0");
    expect(thumb.getAttribute("aria-valuemax")).toBe("100");
  });

  it("anda com as setas, Page Up, Home e End, e mostra o valor ao lado do label", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={[40]} onValueChange={onValueChange} />);
    await user.tab();
    const thumb = screen.getByRole("slider");
    expect(document.activeElement).toBe(thumb);
    await user.keyboard("{ArrowRight}");
    expect(thumb.getAttribute("aria-valuenow")).toBe("41");
    expect(onValueChange).toHaveBeenLastCalledWith([41]);
    expect(screen.getByText("41")).toBeTruthy();
    await user.keyboard("{PageUp}");
    expect(thumb.getAttribute("aria-valuenow")).toBe("51");
    await user.keyboard("{End}");
    expect(thumb.getAttribute("aria-valuenow")).toBe("100");
    await user.keyboard("{Home}");
    expect(thumb.getAttribute("aria-valuenow")).toBe("0");
  });

  it("com duas bolinhas, cada uma tem o próprio nome e a tela mostra a faixa", () => {
    render(<Slider label="Preço" defaultValue={[20, 80]} />);
    expect(screen.getByRole("slider", { name: "Preço mínimo" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Preço máximo" })).toBeTruthy();
    expect(screen.getByText("20–80")).toBeTruthy();
  });

  it("formatValue escreve o valor na tela e para o leitor de tela", () => {
    render(<Slider label="Preço" defaultValue={[40]} formatValue={(v) => `R$ ${v}`} />);
    expect(screen.getByText("R$ 40").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("R$ 40");
  });

  it("sem label, usa o aria-label", () => {
    render(<Slider aria-label="Zoom" defaultValue={[10, 30]} showValue={false} />);
    expect(screen.getByRole("slider", { name: "Zoom mínimo" })).toBeTruthy();
    expect(screen.queryByText("10–30")).toBeNull();
  });

  it("controlado, mostra o valor que vem de fora", () => {
    render(<Slider label="Volume" value={[70]} />);
    expect(screen.getByText("70")).toBeTruthy();
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("70");
  });

  it("lê a ajuda junto com a bolinha", () => {
    render(<Slider label="Volume" defaultValue={[40]} description="Vale para todos os avisos." />);
    expect(screen.getByRole("slider").getAttribute("aria-describedby")).toBe(
      screen.getByText("Vale para todos os avisos.").id,
    );
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(
      <Slider label="Volume" defaultValue={[40]} description="Ajuda." error="Escolha até 80." />,
    );
    const thumb = screen.getByRole("slider");
    expect(screen.queryByText("Ajuda.")).toBeNull();
    const message = screen.getByText("Escolha até 80.");
    expect(thumb.getAttribute("aria-describedby")).toBe(message.id);
    expect(thumb.getAttribute("aria-invalid")).toBe("true");
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("trilho afundado, faixa de marca e bolinha branca", () => {
    render(<Slider label="Volume" defaultValue={[40]} />);
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("text-static-white");
    expect(thumb.className).toContain("ring-subtle");
    expect(thumb.className).toContain("cursor-grab");
    const track = document.querySelector(".inset-shadow-sunken");
    expect(track?.className).toContain("bg-neutral-pressed");
    expect(track?.firstElementChild?.className).toContain("bg-gradient-brand");
  });

  it("desabilitado não anda, não recebe foco e fica cinza", async () => {
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={[40]} disabled />);
    await user.tab();
    const thumb = screen.getByRole("slider");
    expect(document.activeElement).not.toBe(thumb);
    await user.keyboard("{ArrowRight}");
    expect(thumb.getAttribute("aria-valuenow")).toBe("40");
    expect(thumb.className).toContain("ring-disabled");
    expect(document.querySelector(".bg-gradient-brand")).toBeNull();
  });

  it("envia o valor com o formulário", () => {
    const { container } = render(
      <form>
        <Slider label="Volume" name="volume" defaultValue={[40]} />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("volume")).toBe("40");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Slider label="Volume" defaultValue={[40]} description="Para todos os avisos." />
        <Slider label="Preço" labelInfo="Por mês." defaultValue={[20, 80]} />
        <Slider label="Limite" defaultValue={[90]} error="Escolha até 80." />
        <Slider label="Bloqueado" defaultValue={[30]} disabled />
        <Slider aria-label="Zoom" defaultValue={[50]} />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
