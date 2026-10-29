// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch.tsx";

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

describe("Switch", () => {
  it("é um switch com nome, desligado por padrão", () => {
    render(<Switch label="Notificações" />);
    const control = screen.getByRole("switch", { name: "Notificações" });
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("liga e desliga no clique, avisando quem usa", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Notificações" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch");
    await user.click(control);
    expect(control.getAttribute("aria-checked")).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await user.click(control);
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("clicar no label também liga", async () => {
    const user = userEvent.setup();
    render(<Switch label="Notificações" />);
    await user.click(screen.getByText("Notificações"));
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
  });

  it("recebe foco pelo Tab e liga com Espaço e com Enter", async () => {
    const user = userEvent.setup();
    render(<Switch label="Notificações" />);
    await user.tab();
    const control = screen.getByRole("switch");
    expect(document.activeElement).toBe(control);
    await user.keyboard(" ");
    expect(control.getAttribute("aria-checked")).toBe("true");
    await user.keyboard("{Enter}");
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("a bolinha desliza até o outro lado e estica ao ser pressionada", () => {
    render(<Switch label="Notificações" defaultChecked />);
    const thumb = screen.getByRole("switch").querySelector("span");
    expect(thumb?.getAttribute("data-state")).toBe("checked");
    expect(thumb?.className).toContain("data-[state=checked]:translate-x-3");
    expect(thumb?.className).toContain("group-active:w-3.5");
    expect(thumb?.className).toContain("motion-reduce:transition-none");
  });

  it("ligado usa a camada verde do Checkbox e a bolinha branca", () => {
    render(<Switch label="Notificações" />);
    const { className } = screen.getByRole("switch");
    expect(className).toContain("before:bg-gradient-brand");
    expect(className).toContain("text-static-white");
    // Desligado, o trilho é afundado: fundo cinza, sem sombra por fora e sombra por dentro.
    expect(className).toContain("bg-neutral-pressed");
    expect(className).toContain("inset-shadow-sunken");
    expect(className).toContain("shadow-none");
    expect(className).toContain("border-subtle");
    expect(className).toContain("rounded-full");
  });

  it("lê a ajuda junto com o switch", () => {
    render(<Switch label="Notificações" description="Por email e no app." />);
    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBe(
      screen.getByText("Por email e no app.").id,
    );
  });

  it("com erro, o erro substitui a ajuda e marca como inválido", () => {
    render(<Switch label="Backup" description="Todo dia." error="Conecte uma conta antes." />);
    const control = screen.getByRole("switch");
    expect(screen.queryByText("Todo dia.")).toBeNull();
    const message = screen.getByText("Conecte uma conta antes.");
    expect(control.getAttribute("aria-describedby")).toBe(message.id);
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(message.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("desabilitado não liga, não recebe foco e fica cinza, sem esticar", async () => {
    const user = userEvent.setup();
    render(<Switch label="Notificações" disabled />);
    const control = screen.getByRole("switch");
    await user.click(control);
    await user.tab();
    expect(control.getAttribute("aria-checked")).toBe("false");
    expect(document.activeElement).not.toBe(control);
    expect(control.className).toContain("bg-disabled");
    expect(control.className).not.toContain("bg-gradient-brand");
    expect(control.querySelector("span")?.className).not.toContain("group-active:w-3.5");
  });

  it("labelInfo abre a ajuda sem ligar o switch", async () => {
    const user = userEvent.setup();
    render(<Switch label="Backup" labelInfo="Guardamos 30 dias." />);
    await user.click(screen.getByRole("button", { name: "Mais informações sobre Backup" }));
    expect(screen.getByRole("dialog").textContent).toBe("Guardamos 30 dias.");
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
  });

  it("não tem problemas de acessibilidade", async () => {
    const { container } = render(
      <div>
        <Switch label="Notificações" description="Por email e no app." />
        <Switch label="Backup" labelInfo="Guardamos 30 dias." defaultChecked />
        <Switch label="Sincronizar" error="Conecte uma conta antes." />
        <Switch label="Bloqueado" disabled />
        <Switch aria-label="Modo escuro" />
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});
