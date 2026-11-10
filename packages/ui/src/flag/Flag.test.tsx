// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { BR, JP } from "country-flag-icons/react/3x2";
import { afterEach, describe, expect, it } from "vitest";
import { Flag } from "./Flag.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

describe("Flag", () => {
  it("sem label, é decorativa e fica escondida do leitor de tela", () => {
    const { container } = render(
      <Flag>
        <BR />
      </Flag>,
    );
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("com label, é uma imagem com o nome do país", () => {
    render(
      <Flag label="Brasil">
        <BR />
      </Flag>,
    );
    expect(screen.getByRole("img", { name: "Brasil" })).toBeTruthy();
  });

  it("a bandeira preenche a moldura de 20×14, cortando o que sobra", () => {
    const { container } = render(
      <Flag>
        <JP />
      </Flag>,
    );
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.className).toContain("h-3.5");
    expect(frame.className).toContain("w-5");
    expect(frame.className).toContain("shadow-xs");
    const svg = frame.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("preserveAspectRatio")).toBe("xMidYMid slice");
    expect(svg.style.width).toBe("100%");
    expect(svg.style.height).toBe("100%");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Flag label="Brasil">
          <BR />
        </Flag>
        <Flag>
          <JP />
        </Flag>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
