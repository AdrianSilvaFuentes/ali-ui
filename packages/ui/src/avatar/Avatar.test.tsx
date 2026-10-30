// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar, initials } from "./Avatar.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("initials", () => {
  it.each([
    ["Lia Martins", 2, "LM"],
    ["Lia Souza Martins", 2, "LM"],
    ["lia", 2, "L"],
    ["  Caio   Ribeiro ", 2, "CR"],
    ["Lia Martins", 1, "L"],
    ["", 2, ""],
    [undefined, 2, ""],
  ] as const)("%s com até %d letras vira %s", (name, max, expected) => {
    expect(initials(name, max)).toBe(expected);
  });
});

describe("Avatar", () => {
  it("é uma imagem com o nome da pessoa, e não com as iniciais", () => {
    render(<Avatar name="Lia Martins" />);
    const avatar = screen.getByRole("img", { name: "Lia Martins" });
    expect(avatar.textContent).toBe("LM");
  });

  it("no xs, as iniciais têm uma letra só", () => {
    render(<Avatar name="Lia Martins" size="xs" />);
    expect(screen.getByRole("img", { name: "Lia Martins" }).textContent).toBe("L");
  });

  it("sem nome, mostra o ícone de pessoa e é decorativo", () => {
    const { container } = render(<Avatar />);
    const avatar = container.firstElementChild as HTMLElement;
    expect(avatar.getAttribute("aria-hidden")).toBe("true");
    expect(avatar.querySelector("svg")).toBeTruthy();
  });

  it("com foto que ainda não carregou (ou falhou), mostra as iniciais", () => {
    // No jsdom, a imagem nunca carrega: é o mesmo caminho de uma foto que falhou.
    render(<Avatar name="Lia Martins" src="/avatar-sample.png" />);
    expect(screen.getByRole("img", { name: "Lia Martins" }).textContent).toBe("LM");
  });

  it.each([
    ["xs", "size-5", "text-label-xs"],
    ["sm", "size-6", "text-label-sm"],
    ["md", "size-8", "text-label-md"],
    ["lg", "size-10", "text-label-lg"],
    ["xl", "size-12", "text-title-sm"],
  ] as const)("tamanho %s: círculo %s e iniciais em %s", (size, box, text) => {
    render(<Avatar name="Lia Martins" size={size} />);
    const { className } = screen.getByRole("img");
    expect(className).toContain(box);
    expect(className).toContain(text);
    expect(className).toContain("rounded-full");
  });

  it.each([
    ["xs", "[&_svg]:size-3.5"],
    ["sm", "[&_svg]:size-4"],
    ["md", "[&_svg]:size-5"],
    ["lg", "[&_svg]:size-6"],
    ["xl", "[&_svg]:size-8"],
  ] as const)("tamanho %s: ícone de pessoa em %s", (size, icon) => {
    render(<Avatar name="Lia" size={size} />);
    expect(screen.getByRole("img").className).toContain(icon);
  });

  it.each([
    ["xl", "rounded-lg"],
    ["lg", "rounded-lg"],
    ["md", "rounded-lg"],
    ["sm", "rounded-md"],
    ["xs", "rounded-sm"],
  ] as const)("quadrado %s: canto %s", (size, radius) => {
    render(<Avatar name="Lia" size={size} shape="square" />);
    const { className } = screen.getByRole("img");
    expect(className).toContain(radius);
    expect(className).not.toContain("rounded-full");
  });

  it("fundo readonly com contorno suave por dentro e sombra xs", () => {
    render(<Avatar name="Lia Martins" />);
    const { className } = screen.getByRole("img");
    expect(className).toContain("bg-readonly");
    expect(className).toContain("after:border-subtle");
    expect(className).toContain("after:inset-0");
    expect(className).not.toContain("ring-");
    expect(className).toContain("shadow-xs");
    expect(className).toContain("inset-shadow-shade");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Avatar name="Lia Martins" />
        <Avatar name="Caio Ribeiro" size="xs" />
        <Avatar name="Nara Torres" src="/avatar-sample.png" size="xl" />
        <Avatar />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
