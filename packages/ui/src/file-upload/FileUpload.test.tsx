// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUpload, formatFileSize } from "./FileUpload.tsx";

afterEach(cleanup);

// O Toggletip do label mede elementos com ResizeObserver, que o jsdom não tem.
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

function file(name: string, type: string, size = 1000) {
  return new File([new Uint8Array(size)], name, { type });
}

const fileInput = (container: HTMLElement) =>
  container.querySelector("input[type=file]") as HTMLInputElement;
const zone = () => screen.getByRole("button", { name: "Anexos" });

describe("FileUpload", () => {
  it("é um botão com o nome do label, que descreve a ação e a dica", () => {
    render(<FileUpload label="Anexos" hint="PDF, até 5 MB" />);
    const description = zone().getAttribute("aria-describedby") ?? "";
    const texts = description.split(" ").map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(["Arraste um arquivo ou escolha", "PDF, até 5 MB"]);
  });

  it("clicar na área abre a escolha de arquivos", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="Anexos" />);
    const click = vi.spyOn(fileInput(container), "click");
    await user.click(zone());
    expect(click).toHaveBeenCalled();
  });

  it("o arquivo escolhido aparece na lista com tamanho e X, e avisa quem usa", async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const { container } = render(<FileUpload label="Anexos" onFilesChange={onFilesChange} />);
    const contract = file("contrato.pdf", "application/pdf", 1258291);
    await user.upload(fileInput(container), contract);
    expect(onFilesChange).toHaveBeenLastCalledWith([contract]);
    const list = screen.getByRole("list", { name: "Arquivos escolhidos" });
    expect(list.textContent).toContain("contrato.pdf");
    expect(list.textContent).toContain("1,2 MB");
    expect(screen.getByRole("status").textContent).toBe("contrato.pdf adicionado.");
    expect(screen.getByRole("button", { name: "Remover contrato.pdf" })).toBeTruthy();
  });

  it("com um arquivo só, o novo troca o anterior", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="Anexos" />);
    await user.upload(fileInput(container), file("a.pdf", "application/pdf"));
    await user.upload(fileInput(container), file("b.pdf", "application/pdf"));
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      expect.stringContaining("b.pdf"),
    ]);
  });

  it("com multiple, soma os arquivos", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="Anexos" multiple />);
    await user.upload(fileInput(container), [file("a.pdf", "application/pdf")]);
    await user.upload(fileInput(container), [
      file("b.png", "image/png"),
      file("c.png", "image/png"),
    ]);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("status").textContent).toBe("2 arquivos adicionados.");
    expect(zone().textContent).toContain("Arraste arquivos ou escolha");
  });

  it("soltar arquivos na área também adiciona, e a área marca o arrasto", () => {
    render(<FileUpload label="Anexos" multiple />);
    fireEvent.dragOver(zone());
    expect(zone().getAttribute("data-dragging")).toBe("true");
    fireEvent.drop(zone(), { dataTransfer: { files: [file("foto.png", "image/png")] } });
    expect(zone().hasAttribute("data-dragging")).toBe(false);
    expect(screen.getByText("foto.png")).toBeTruthy();
  });

  it("recusa tipo errado e arquivo grande demais, dizendo qual e por quê", () => {
    render(<FileUpload label="Anexos" multiple accept=".pdf,image/*" maxSize={5 * 1024 * 1024} />);
    fireEvent.drop(zone(), {
      dataTransfer: {
        files: [
          file("ok.pdf", "application/pdf"),
          file("foto.jpg", "image/jpeg"),
          file("planilha.xlsx", "application/vnd.ms-excel"),
          file("video.pdf", "application/pdf", 6 * 1024 * 1024),
        ],
      },
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const message = screen.getByText(/planilha\.xlsx/);
    expect(message.textContent).toBe(
      "planilha.xlsx não é de um tipo aceito. video.pdf passa de 5 MB.",
    );
    expect(zone().getAttribute("aria-describedby")).toContain(message.closest("p")?.id);
  });

  it("o X remove o arquivo e leva o foco para o próximo X, ou para a área", async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="Anexos" multiple />);
    await user.upload(fileInput(container), [
      file("a.pdf", "application/pdf"),
      file("b.pdf", "application/pdf"),
    ]);
    await user.click(screen.getByRole("button", { name: "Remover a.pdf" }));
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Remover b.pdf" }));
    await user.keyboard("{Enter}");
    expect(screen.queryByRole("list")).toBeNull();
    expect(document.activeElement).toBe(zone());
    expect(screen.getByRole("status").textContent).toBe("b.pdf removido.");
  });

  it("com erro, o erro substitui a ajuda", () => {
    render(<FileUpload label="Anexos" description="Ajuda." error="Envie o contrato." />);
    expect(screen.queryByText("Ajuda.")).toBeNull();
    const message = screen.getByText("Envie o contrato.");
    expect(zone().getAttribute("aria-describedby")).toContain(message.id);
    expect(zone().getAttribute("data-invalid")).toBe("true");
  });

  it("desabilitado não abre nem aceita arquivos", () => {
    render(<FileUpload label="Anexos" disabled />);
    expect(zone().hasAttribute("disabled")).toBe(true);
    fireEvent.drop(zone(), { dataTransfer: { files: [file("a.pdf", "application/pdf")] } });
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("escreve o tamanho com vírgula e a unidade certa", () => {
    expect(formatFileSize(820)).toBe("820 bytes");
    expect(formatFileSize(820 * 1024)).toBe("820 KB");
    expect(formatFileSize(1.25 * 1024 * 1024)).toBe("1,3 MB");
  });

  it("não tem problemas de acessibilidade", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <FileUpload label="Anexos" hint="PDF, até 5 MB" description="Opcional." multiple />
        <FileUpload label="Contrato" labelInfo="Assinado." error="Envie o contrato." />
        <FileUpload aria-label="Foto" disabled />
      </div>,
    );
    await user.upload(fileInput(container), file("a.pdf", "application/pdf"));
    expect(await violations(container)).toEqual([]);
  });
});
