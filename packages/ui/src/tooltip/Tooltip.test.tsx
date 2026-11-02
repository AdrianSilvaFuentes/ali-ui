// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip.tsx";

afterEach(cleanup);

// O tail mede o próprio tamanho com ResizeObserver, que o jsdom não tem.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/**
 * Violações de acessibilidade. O contraste de cor é testado nos tokens. A regra "region" fica de
 * fora: o Radix põe o tooltip no fim do body, fora dos landmarks, e o texto já chega ao leitor
 * de tela como descrição do botão (aria-describedby).
 */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return result.violations.map((v) => v.id);
}

function Example() {
  return (
    <Tooltip content="Copiar link" delay={0}>
      <button type="button" aria-label="Copiar">
        C
      </button>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("fechado, o rótulo não aparece", () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("abre no foco pelo teclado, descreve o botão e fecha com Esc", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Copiar" });
    expect(document.activeElement).toBe(trigger);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip.textContent).toBe("Copiar link");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  // Fechar ao tirar o mouse depende da posição real dos elementos, que o jsdom não mede:
  // é conferido no navegador.
  it("abre ao passar o mouse", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole("button"));
    expect(await screen.findByRole("tooltip")).toBeTruthy();
  });

  it("o balão usa o fundo invertido, texto body-md e sombra md", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole("tooltip");
    // O role fica numa cópia escondida para o leitor de tela; o balão visível tem o data-side.
    const bubble = document.querySelector("[data-side]");
    const className = bubble?.getAttribute("class") ?? "";
    expect(className).toContain("bg-surface-inverse");
    expect(className).toContain("text-inverse");
    expect(className).toContain("text-body-md");
    expect(className).toContain("rounded-lg");
    expect(className).toContain("animate-enter-exit");
    expect(className).toContain("shadow-md");
    expect(className).not.toContain("shadow-overlay");
    const tail = bubble?.querySelector("svg");
    expect(tail?.getAttribute("aria-hidden")).toBe("true");
    expect(tail?.querySelector("path")?.getAttribute("class")).toContain(
      "fill-[var(--ali-color-surface-inverse)]",
    );
  });

  it("não tem problemas de acessibilidade, fechado e aberto", async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(await violations(document.body)).toEqual([]);
    await user.tab();
    await screen.findByRole("tooltip");
    expect(await violations(document.body)).toEqual([]);
  });
});
