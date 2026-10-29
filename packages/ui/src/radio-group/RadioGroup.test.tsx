// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioGroupItem } from "./RadioGroup.tsx";

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

function Plans(props: Partial<Parameters<typeof RadioGroup>[0]>) {
  return (
    <RadioGroup label="Plano" {...props}>
      <RadioGroupItem value="free" label="Grátis" />
      <RadioGroupItem value="pro" label="Pro" description="Para times pequenos." />
      <RadioGroupItem value="team" label="Time" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("é um grupo com nome, e cada opção é um radio com nome", () => {
    render(<Plans />);
    expect(screen.getByRole("radiogroup", { name: "Plano" })).toBeTruthy();
    expect(
      screen.getAllByRole("radio").map((r) => r.getAttribute("aria-label") ?? r.id),
    ).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Pro" })).toBeTruthy();
  });

  it("escolhe no clique, e só uma opção fica marcada", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await user.click(screen.getByRole("radio", { name: "Grátis" }));
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    expect(screen.getByRole("radio", { name: "Pro" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "Grátis" }).getAttribute("aria-checked")).toBe(
      "false",
    );
  });

  it("clicar no label também escolhe", async () => {
    const user = userEvent.setup();
    render(<Plans />);
    await user.click(screen.getByText("Time"));
    expect(screen.getByRole("radio", { name: "Time" }).getAttribute("aria-checked")).toBe("true");
  });

  it("o Tab entra na opção marcada e as setas trocam a opção", async () => {
    const user = userEvent.setup();
    render(<Plans defaultValue="pro" />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Pro" }));
    // A seta fica pressionada enquanto o foco anda, como numa pessoa: o Radix escolhe a opção
    // ao receber o foco com a seta apertada.
    await user.keyboard("{ArrowDown>}");
    const team = screen.getByRole("radio", { name: "Time" });
    await waitFor(() => expect(document.activeElement).toBe(team));
    await user.keyboard("{/ArrowDown}");
    expect(team.getAttribute("aria-checked")).toBe("true");
  });

  it("a ajuda da opção é lida junto com ela", () => {
    render(<Plans />);
    expect(screen.getByRole("radio", { name: "Pro" }).getAttribute("aria-describedby")).toBe(
      screen.getByText("Para times pequenos.").id,
    );
  });

  it("a ajuda do grupo é lida junto com o grupo", () => {
    render(<Plans description="Você pode trocar depois." />);
    expect(screen.getByRole("radiogroup").getAttribute("aria-describedby")).toBe(
      screen.getByText("Você pode trocar depois.").id,
    );
  });

  it("com erro, o erro substitui a ajuda e as bolinhas ficam vermelhas", () => {
    render(<Plans description="Você pode trocar depois." error="Escolha um plano." />);
    const group = screen.getByRole("radiogroup");
    expect(screen.queryByText("Você pode trocar depois.")).toBeNull();
    const message = screen.getByText("Escolha um plano.");
    expect(group.getAttribute("aria-describedby")).toBe(message.id);
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.hasAttribute("data-invalid")).toBe(true);
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByRole("radio", { name: "Pro" }).className).toContain(
      "group-data-invalid/radios:border-danger",
    );
  });

  it("uma opção desabilitada não é escolhida e fica cinza", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup label="Plano">
        <RadioGroupItem value="free" label="Grátis" />
        <RadioGroupItem value="team" label="Time" disabled />
      </RadioGroup>,
    );
    const team = screen.getByRole("radio", { name: "Time" });
    await user.click(team);
    expect(team.getAttribute("aria-checked")).toBe("false");
    expect(team.className).toContain("bg-disabled");
    expect(team.className).not.toContain("bg-gradient-brand");
  });

  it("o grupo desabilitado desabilita todas as opções", () => {
    render(<Plans disabled />);
    for (const radio of screen.getAllByRole("radio")) {
      expect((radio as HTMLButtonElement).disabled).toBe(true);
      expect(radio.className).toContain("cursor-not-allowed");
    }
  });

  it("bolinha redonda com a camada verde do Checkbox e o ponto que cresce", async () => {
    const user = userEvent.setup();
    render(<Plans />);
    const pro = screen.getByRole("radio", { name: "Pro" });
    expect(pro.className).toContain("rounded-full");
    expect(pro.className).toContain("before:bg-gradient-brand");
    expect(pro.className).toContain("border-subtle");
    await user.click(pro);
    expect(pro.querySelector("[data-state]")?.className).toContain(
      "data-[state=checked]:animate-scale-in",
    );
  });

  it("horizontal põe as opções lado a lado", () => {
    render(<Plans orientation="horizontal" />);
    const group = screen.getByRole("radiogroup");
    expect(group.getAttribute("aria-orientation")).toBe("horizontal");
    expect(group.className).toContain("flex-row");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Plans
          description="Você pode trocar depois."
          labelInfo="Cobrança mensal."
          defaultValue="pro"
        />
        <Plans error="Escolha um plano." />
        <Plans disabled />
        <RadioGroup aria-label="Tema">
          <RadioGroupItem value="claro" label="Claro" />
          <RadioGroupItem value="escuro" label="Escuro" />
        </RadioGroup>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
