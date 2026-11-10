// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Chip", () => {
  it("mostra o nome e o avatar com as iniciais, sem anunciar o avatar de novo", () => {
    const { container } = render(<Chip name="Ana Souza" />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip.textContent).toBe("ASAna Souza");
    expect(chip.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("é uma pílula branca com contorno sutil, sombra xs, brilho e hover no chip todo", () => {
    const { container } = render(<Chip name="Ana" />);
    const { className } = container.firstElementChild as HTMLElement;
    for (const name of [
      "rounded-2xl",
      "text-label-sm",
      "hover:bg-neutral-hovered",
      "bg-neutral",
      "after:border-subtle",
      "shadow-xs",
      "inset-shadow-highlight",
    ]) {
      expect(className).toContain(name);
    }
  });

  it("sem onRemove, não tem X", () => {
    render(<Chip name="Ana" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("o X tem nome e remove no clique", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip name="Ana" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remover Ana" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("pelo teclado, Enter, Delete e Backspace removem", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Chip name="Ana" onRemove={onRemove} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("button"));
    await user.keyboard("{Enter}");
    await user.keyboard("{Delete}");
    await user.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(3);
  });

  it("removeLabel troca o nome do X", () => {
    render(<Chip name="Ana" onRemove={() => {}} removeLabel="Tirar Ana do time" />);
    expect(screen.getByRole("button", { name: "Tirar Ana do time" })).toBeTruthy();
  });

  it("respiro: 2px à esquerda; à direita, 6px com X, 8px (sm) ou 10px (md) sem X", () => {
    const { container, rerender } = render(<Chip name="Ana" size="sm" onRemove={() => {}} />);
    const chip = () => (container.firstElementChild as HTMLElement).className.split(" ");
    expect(chip()).toEqual(expect.arrayContaining(["pl-0.5", "pr-1.5"]));
    rerender(<Chip name="Ana" size="sm" />);
    expect(chip()).toContain("pr-2");
    rerender(<Chip name="Ana" size="md" onRemove={() => {}} />);
    expect(chip()).toContain("pr-1.5");
    rerender(<Chip name="Ana" size="md" />);
    expect(chip()).toContain("pr-2.5");
  });

  it("os tamanhos: sm de 24px e md de 28px", () => {
    const { container, rerender } = render(<Chip name="Ana" size="sm" />);
    expect((container.firstElementChild as HTMLElement).className).toContain("h-6");
    rerender(<Chip name="Ana" />);
    expect((container.firstElementChild as HTMLElement).className).toContain("h-7");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Chip name="Ana Souza" />
        <Chip name="Caio Ribeiro" size="sm" onRemove={() => {}} />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
