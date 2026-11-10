// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl.tsx";

afterEach(cleanup);

// O fundo que desliza e o Toggletip do label medem elementos com ResizeObserver, que o jsdom
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

function Period(props: Partial<Parameters<typeof SegmentedControl>[0]>) {
  return (
    <SegmentedControl label="Período" defaultValue="week" {...props}>
      <SegmentedControlItem value="day">Dia</SegmentedControlItem>
      <SegmentedControlItem value="week">Semana</SegmentedControlItem>
      <SegmentedControlItem value="month">Mês</SegmentedControlItem>
    </SegmentedControl>
  );
}

describe("SegmentedControl", () => {
  it("é um grupo de rádio com o nome do label e a opção inicial escolhida", () => {
    render(<Period />);
    expect(screen.getByRole("radiogroup", { name: "Período" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Semana" }).getAttribute("aria-checked")).toBe("true");
  });

  it("escolhe no clique, avisando quem usa", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Period onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Mês" }));
    expect(screen.getByRole("radio", { name: "Mês" }).getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("month");
  });

  it("o Tab entra na escolhida e as setas trocam a opção", async () => {
    const user = userEvent.setup();
    render(<Period />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Semana" }));
    // A seta fica pressionada enquanto o foco anda, como numa pessoa: o Radix escolhe a opção
    // ao receber o foco com a seta apertada.
    await user.keyboard("{ArrowRight>}");
    const month = screen.getByRole("radio", { name: "Mês" });
    await waitFor(() => expect(document.activeElement).toBe(month));
    await user.keyboard("{/ArrowRight}");
    expect(month.getAttribute("aria-checked")).toBe("true");
  });

  it("o fundo elevado marca a escolhida, não só a cor do texto", () => {
    render(<Period />);
    const group = screen.getByRole("radiogroup");
    const marker = group.querySelector("[aria-hidden]");
    expect(marker?.className).toContain("bg-neutral");
    expect(marker?.className).toContain("inset-shadow-highlight");
    expect(group.className).toContain("bg-surface-sunken");
    expect(screen.getByRole("radio", { name: "Dia" }).className).toContain(
      "data-[state=checked]:text-default",
    );
  });

  it("os tamanhos seguem o Input: 28px por opção no sm, 36px no md", () => {
    render(<Period size="sm" />);
    expect(screen.getByRole("radio", { name: "Dia" }).className).toContain("h-7");
    cleanup();
    render(<Period />);
    expect(screen.getByRole("radio", { name: "Dia" }).className).toContain("h-9");
  });

  it("fullWidth divide a largura toda entre as opções", () => {
    render(<Period fullWidth />);
    expect(screen.getByRole("radiogroup").className).toContain("w-full");
    expect(screen.getByRole("radio", { name: "Dia" }).className).toContain("flex-1");
  });

  it("lê a ajuda junto com o grupo", () => {
    render(<Period description="Os gráficos mostram este período." />);
    expect(screen.getByRole("radiogroup").getAttribute("aria-describedby")).toBe(
      screen.getByText("Os gráficos mostram este período.").id,
    );
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<Period description="Ajuda." error="Escolha um período." />);
    const group = screen.getByRole("radiogroup");
    expect(screen.queryByText("Ajuda.")).toBeNull();
    const message = screen.getByText("Escolha um período.");
    expect(group.getAttribute("aria-describedby")).toBe(message.id);
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("desabilitado não troca e não recebe foco", async () => {
    const user = userEvent.setup();
    render(<Period disabled />);
    await user.click(screen.getByRole("radio", { name: "Dia" }));
    await user.tab();
    expect(screen.getByRole("radio", { name: "Semana" }).getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(document.body);
  });

  it("envia a escolha com o formulário", () => {
    const { container } = render(
      <form>
        <Period name="period" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("period")).toBe("week");
  });

  it("icon vai antes do texto, escondido do leitor de tela; só ícone usa o aria-label", () => {
    render(
      <SegmentedControl aria-label="Visualização" defaultValue="list">
        <SegmentedControlItem value="list" icon={<svg data-testid="icon" />}>
          Lista
        </SegmentedControlItem>
        <SegmentedControlItem value="grid" aria-label="Grade" icon={<svg />} />
      </SegmentedControl>,
    );
    const list = screen.getByRole("radio", { name: "Lista" });
    const icon = screen.getByTestId("icon").parentElement;
    expect(list.firstElementChild).toBe(icon);
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("radio", { name: "Grade" })).toBeTruthy();
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Period description="Os gráficos mostram este período." />
        <Period labelInfo="Começa na segunda." error="Escolha um período." />
        <Period disabled />
        <SegmentedControl aria-label="Visualização" defaultValue="list" size="sm">
          <SegmentedControlItem value="list">Lista</SegmentedControlItem>
          <SegmentedControlItem value="grid">Grade</SegmentedControlItem>
        </SegmentedControl>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
