// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Toggletip } from "./Toggletip.tsx";

afterEach(cleanup);

// O tail mede o próprio tamanho com ResizeObserver, que o jsdom não tem.
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

describe("Toggletip", () => {
  it("o ícone é um botão com nome para o leitor de tela", () => {
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    const trigger = screen.getByRole("button", { name: "Mais informações" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    const icon = trigger.querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.getAttribute("class")).toContain("size-3.5");
  });

  it("aceita outro nome para o botão", () => {
    render(<Toggletip label="Sobre o email">Usamos só para avisos.</Toggletip>);
    expect(screen.getByRole("button", { name: "Sobre o email" })).toBeTruthy();
  });

  it("fechado, o texto não aparece", () => {
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    expect(screen.queryByText("Usamos só para avisos.")).toBeNull();
  });

  it("abre no clique, leva o foco ao balão e fecha num novo clique", async () => {
    const user = userEvent.setup();
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    const trigger = screen.getByRole("button", { name: "Mais informações" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Mais informações" });
    expect(dialog.textContent).toBe("Usamos só para avisos.");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(dialog);
    await user.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abre pelo teclado e fecha com Esc, devolvendo o foco ao ícone", async () => {
    const user = userEvent.setup();
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Mais informações" });
    expect(document.activeElement).toBe(trigger);
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("fecha ao clicar fora", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Toggletip>Usamos só para avisos.</Toggletip>
        <p>Fora</p>
      </div>,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(screen.getByText("Fora"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("o botão tem área de toque de 24px e o anel de foco fica dentro dela", () => {
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    const { className } = screen.getByRole("button");
    expect(className).toContain("size-6");
    expect(className).toContain("-m-1");
    expect(className).toContain("cursor-pointer");
    expect(className).toContain("outline-focus");
    expect(className).toContain("focus-visible:outline-2");
    expect(className).toContain("focus-visible:-outline-offset-2");
    expect(className).toContain("motion-reduce:-outline-offset-2");
  });

  it("o balão usa a superfície de overlay, sombra md e texto body-md", async () => {
    const user = userEvent.setup();
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    await user.click(screen.getByRole("button"));
    const { className } = screen.getByRole("dialog");
    expect(className).toContain("bg-surface-overlay");
    expect(className).toContain("shadow-md");
    expect(className).not.toContain("shadow-overlay");
    expect(className).toContain("text-body-md");
    expect(className).toContain("inset-shadow-highlight");
    expect(className).toContain("rounded-xl");
    expect(className).toContain("animate-enter-exit");
  });

  it("o balão tem um tail escondido do leitor de tela", async () => {
    const user = userEvent.setup();
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    await user.click(screen.getByRole("button"));
    const tail = screen.getByRole("dialog").querySelector("svg");
    expect(tail?.getAttribute("aria-hidden")).toBe("true");
    expect(tail?.querySelector("path")?.getAttribute("class")).toContain(
      "fill-[var(--ali-color-surface-overlay)]",
    );
  });

  it("não tem problemas de acessibilidade, fechado e aberto", async () => {
    const user = userEvent.setup();
    render(<Toggletip>Usamos só para avisos.</Toggletip>);
    expect(await violations(document.body)).toEqual([]);
    await user.click(screen.getByRole("button"));
    expect(await violations(document.body)).toEqual([]);
  });
});
