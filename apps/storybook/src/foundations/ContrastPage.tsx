import { Button, Checkbox, Input, Switch } from "@ali/ui";
import { Code, Section, Table, TokensLayout } from "./TokensLayout";

/** As exceções conscientes do visual padrão: onde ele fica abaixo da WCAG AA, e por quê. */
const exceptions = [
  [
    "Texto branco sobre o degradê da marca",
    "Button primary; check do Checkbox; Radio e Switch marcados",
    "≈ 2.35:1 (pede 4.5:1)",
    "A marca fica viva e clara. No modo mais contraste, passa de 4.5:1.",
  ],
  [
    "Borda subtle em repouso",
    "Input, Textarea, Select, Checkbox, Radio, Switch",
    "≈ 1.3:1 (pede 3:1)",
    "Campos leves. Escurece no hover e no foco; no modo mais contraste, usa border-default.",
  ],
  [
    "Placeholder no tema claro",
    "Input, Textarea, Select",
    "3.28:1 (pede 4.5:1)",
    "O campo vazio não parece preenchido. Só leva exemplos, nunca instruções.",
  ],
] as const;

/** Os mesmos controles, para comparar o padrão e o modo mais contraste lado a lado. */
function Sample() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-neutral p-5 shadow-raised">
      <Input size="sm" label="Nome" placeholder="Loja de verão" />
      <div className="flex flex-col gap-3">
        <Checkbox label="Receber novidades" defaultChecked />
        <Switch label="Avisos por email" defaultChecked />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary">
          Cancelar
        </Button>
        <Button size="sm">Salvar</Button>
      </div>
    </div>
  );
}

export function ContrastPage() {
  return (
    <TokensLayout
      title="Contrast"
      description="O visual padrão da Ali UI tem algumas exceções conscientes de contraste, para a marca e os campos ficarem leves. Para quem precisa de mais, existe o modo mais contraste, como o Aumentar contraste do iOS e do macOS."
    >
      {() => (
        <>
          <Section
            title="Padrão e mais contraste"
            description="À esquerda, o padrão; à direita, o modo mais contraste. Os degradês da marca ganham uma camada preta de 30% e as bordas subtle usam border-default. Nada mais muda, em nenhuma marca."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-label-md text-subtle">Padrão</p>
                <div data-contrast="standard">
                  <Sample />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-label-md text-subtle">Mais contraste</p>
                <div data-contrast="more">
                  <Sample />
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Como ligar"
            description="O modo liga sozinho para quem já pediu mais contraste no sistema (prefers-contrast: more). Também dá para ligar e desligar por um atributo, em qualquer elemento: vale para ele e tudo dentro."
          >
            <Table columns={["Atributo", "Efeito"]}>
              {[
                ['data-contrast="more"', "Liga o modo mais contraste."],
                [
                  'data-contrast="standard"',
                  "Mantém o padrão, mesmo com a preferência do sistema ligada.",
                ],
                ["(sem atributo)", "Segue a preferência do sistema."],
              ].map(([attribute, effect]) => (
                <tr key={attribute} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Code>{attribute}</Code>
                  </td>
                  <td className="px-4 py-3 text-body-md">{effect}</td>
                </tr>
              ))}
            </Table>
            <p className="mt-3 max-w-prose text-body-md text-subtle">
              No Storybook, o seletor Contraste da barra de ferramentas faz o mesmo em todas as
              páginas.
            </p>
          </Section>

          <Section
            title="Exceções conscientes do padrão"
            description="Onde o visual padrão fica abaixo da WCAG AA, e o motivo. A WCAG pede o contraste sem a pessoa precisar ligar nada; por isso estas são exceções escolhidas, documentadas, e não descuidos. Produtos com obrigação legal de WCAG AA podem ligar o modo mais contraste por padrão."
          >
            <Table columns={["O quê", "Onde", "Contraste", "Por quê"]}>
              {exceptions.map(([what, where, ratio, why]) => (
                <tr key={what} className="border-t border-subtle align-top">
                  <td className="px-4 py-3 text-label-md">{what}</td>
                  <td className="px-4 py-3 text-body-md text-subtle">{where}</td>
                  <td className="px-4 py-3 text-body-md whitespace-nowrap">{ratio}</td>
                  <td className="px-4 py-3 text-body-md text-subtle">{why}</td>
                </tr>
              ))}
            </Table>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
