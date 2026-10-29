// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FieldError, FieldHelp } from "./FieldMessage.tsx";

afterEach(cleanup);

describe("FieldMessage", () => {
  it("a ajuda usa body-md em text-subtle e aceita um recuo", () => {
    render(
      <FieldHelp id="ajuda" className="pl-6">
        Ajuda.
      </FieldHelp>,
    );
    const help = screen.getByText("Ajuda.");
    expect(help.id).toBe("ajuda");
    expect(help.className).toContain("text-body-md");
    expect(help.className).toContain("text-subtle");
    expect(help.className).toContain("pl-6");
  });

  it("o erro tem ícone escondido do leitor de tela e texto em text-danger", () => {
    render(<FieldError id="erro">Falta o domínio.</FieldError>);
    const error = screen.getByText("Falta o domínio.");
    expect(error.id).toBe("erro");
    expect(error.className).toContain("text-danger");
    expect(error.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("o ícone do erro acompanha a primeira linha, mesmo com o texto em várias linhas", () => {
    render(<FieldError>Uma mensagem longa que quebra em duas linhas.</FieldError>);
    const error = screen.getByText("Uma mensagem longa que quebra em duas linhas.");
    // Alinhado ao topo, e não ao centro do bloco de texto.
    expect(error.className).toContain("items-start");
    expect(error.className).not.toContain("items-center");
    // O ícone fica numa caixa de uma linha de altura, centrado nela.
    const iconBox = error.querySelector("svg")?.parentElement;
    expect(iconBox?.className).toContain("h-[1lh]");
    expect(iconBox?.className).toContain("items-center");
  });
});
