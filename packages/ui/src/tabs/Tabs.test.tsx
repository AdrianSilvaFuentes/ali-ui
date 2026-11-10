// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs.tsx";

afterEach(cleanup);

/** Violações de acessibilidade (o contraste de cor é testado nos tokens). */
async function violations(container: HTMLElement) {
  const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return result.violations.map((v) => v.id);
}

function Example(props: { variant?: "line" | "segmented"; onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue="a" {...props}>
      <TabsList aria-label="Projeto">
        <TabsTrigger value="a">Visão geral</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Atividade
        </TabsTrigger>
        <TabsTrigger value="c">Ajustes</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Resumo</TabsContent>
      <TabsContent value="b">Mudanças</TabsContent>
      <TabsContent value="c">Nome e visibilidade</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("icon vai antes do texto, escondido do leitor de tela", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Projeto">
          <TabsTrigger value="a" icon={<svg data-testid="icon" />}>
            Visão geral
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const tab = screen.getByRole("tab", { name: "Visão geral" });
    const icon = screen.getByTestId("icon").parentElement;
    expect(tab.firstElementChild).toBe(icon);
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("tem lista com nome, abas e o painel da aba ativa", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Projeto" })).toBeTruthy();
    const active = screen.getByRole("tab", { name: "Visão geral" });
    expect(active.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Resumo");
  });

  it("troca e foca a aba no clique, avisando quem usa", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Ajustes" }));
    expect(onValueChange).toHaveBeenLastCalledWith("c");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Ajustes" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Nome e visibilidade");
  });

  it("anda pelas setas pulando a aba desabilitada, e o Tab vai para o painel", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Visão geral" }));
    await user.keyboard("{ArrowRight}");
    const settings = screen.getByRole("tab", { name: "Ajustes" });
    expect(document.activeElement).toBe(settings);
    expect(settings.getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Visão geral" }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole("tabpanel"));
  });

  it("a aba desabilitada não troca o conteúdo", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Atividade" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Resumo");
  });

  it("não tem violações de acessibilidade nas duas variantes", async () => {
    for (const variant of ["line", "segmented"] as const) {
      const { container, unmount } = render(<Example variant={variant} />);
      expect(await violations(container)).toEqual([]);
      unmount();
    }
  });
});
