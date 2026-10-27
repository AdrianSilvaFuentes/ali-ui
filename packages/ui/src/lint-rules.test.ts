import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

// Confere que as regras de lint dos componentes (biome.json) continuam funcionando.
// Cada exemplo vira um arquivo em packages/ui/src de uma cópia temporária do projeto,
// com a mesma configuração do Biome.
const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const biome = createRequire(import.meta.url).resolve("@biomejs/biome/bin/biome");

const sandbox = mkdtempSync(join(tmpdir(), "ali-ui-lint-"));
cpSync(join(repoRoot, "biome.json"), join(sandbox, "biome.json"));
cpSync(join(repoRoot, "biome"), join(sandbox, "biome"), { recursive: true });
mkdirSync(join(sandbox, "packages/ui/src"), { recursive: true });
afterAll(() => rmSync(sandbox, { recursive: true, force: true }));

let fileCount = 0;

/** Roda o lint como se `source` fosse um arquivo de componente em packages/ui. */
function lint(source: string): { ok: boolean; output: string } {
  const file = `packages/ui/src/Example${fileCount++}.tsx`;
  writeFileSync(join(sandbox, file), source);
  const result = spawnSync(process.execPath, [biome, "lint", "--vcs-enabled=false", file], {
    cwd: sandbox,
    encoding: "utf8",
  });
  return { ok: result.status === 0, output: result.stdout + result.stderr };
}

const component = (className: string) =>
  `export const Example = () => <div className="${className}" />;\n`;

describe("regra: sem valores arbitrários fixos do Tailwind", () => {
  it.each([
    "bg-[#ff0000]",
    "p-[13px]",
    "text-[1.0625rem]",
    "w-[50%]",
    "border-[rgb(0,0,0)]",
    "text-[oklch(0.5_0.1_20)]",
    "[color:#123456]",
    "hover:bg-[#ff0000]/50",
  ])("falha com %s", (cls) => {
    const { ok, output } = lint(component(`p-4 ${cls}`));
    expect(ok).toBe(false);
    expect(output).toContain("Valor arbitrário fixo no Tailwind");
  });

  it.each([
    "p-4 bg-primary text-body rounded-sm",
    "data-[state=open]:bg-muted",
    "[&>svg]:size-4",
    "grid-cols-[repeat(2,1fr)]",
    "bg-[var(--ali-color-primary)]",
  ])("passa com %s", (cls) => {
    expect(lint(component(cls))).toMatchObject({ ok: true });
  });

  it("também vale para classes em textos fora do JSX (cva, cn)", () => {
    expect(lint(`export const base = "p-4 p-[13px]";\n`).ok).toBe(false);
    // biome-ignore lint/suspicious/noTemplateCurlyInString: o texto é código de exemplo.
    expect(lint("export const base = `p-4 ${String(1)} bg-[#fff]`;\n").ok).toBe(false);
  });
});

describe("regra: componentes não importam primitivos", () => {
  it("falha ao importar @ali/tokens/primitives", () => {
    const { ok, output } = lint(
      'import { gray } from "@ali/tokens/primitives";\n\nexport const x = gray[100];\n',
    );
    expect(ok).toBe(false);
    expect(output).toContain("nunca primitivos");
  });

  it("passa ao importar os tokens semânticos", () => {
    expect(
      lint('import { vars } from "@ali/tokens";\n\nexport const x = vars.color.primary;\n'),
    ).toMatchObject({ ok: true });
  });
});
