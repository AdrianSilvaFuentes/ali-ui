import { cssVarName, elevation, insetShadow, shadow, vars } from "@ali/tokens";
import { Code, Section, Table, TokensLayout } from "./TokensLayout";

/** Onde cada sombra da escala aparece: o que já usa e o que deve usar quando existir. */
const scaleUsage: Record<keyof typeof shadow, string> = {
  "2xs": "Detalhes quase planos, como um chip ou uma tag. Ainda sem uso.",
  xs: "Caixas de preview e tabela de props desta documentação.",
  sm: "Button, Input e Textarea: o que fica na página e se clica ou preenche.",
  md: "Toggletip: balões pequenos de ajuda, que flutuam sem pesar.",
  lg: "A mesma do overlay: menus, popovers e diálogos.",
  xl: "Painéis laterais e diálogos grandes. Ainda sem uso.",
  "2xl": "Destaque raro, como um modal de boas-vindas. Ainda sem uso.",
};

/** Onde cada sombra por uso aparece. */
const elevationUsage: Record<keyof typeof elevation, string> = {
  raised: "Cartões e painéis um pouco acima da página.",
  overlay: "Menus, popovers e diálogos. Balões pequenos, como o Toggletip, usam shadow-md.",
};

export function ShadowTokensPage() {
  return (
    <TokensLayout
      title="Shadow"
      description="Sombras por nível de elevação: os valores padrão do Tailwind CSS 4, sem alterações."
    >
      {() => (
        <>
          <Section
            title="Por uso"
            description="Sombras com nome de superfície. Prefira estas nos componentes: cada superfície elevada já vem com a sua."
          >
            <Table
              columns={["Token", "Classe", "Variável CSS", "Equivale a", "Use com", "Onde usar"]}
            >
              {(Object.keys(elevation) as (keyof typeof elevation)[]).map((name) => (
                <tr key={name} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 text-label-md whitespace-nowrap">{name}</td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    shadow-{name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Code>{cssVarName("elevation", name)}</Code>
                  </td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    {name === "raised" ? "shadow-sm" : "shadow-lg"}
                  </td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    bg-surface-{name}
                  </td>
                  <td className="px-4 py-3 text-body-md">{elevationUsage[name]}</td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Brilho interno"
            description="Sombra por dentro da borda. highlight é uma linha fina e clara no topo, como luz vinda de cima, que dá volume. Soma com as sombras externas: use shadow-sm inset-shadow-highlight."
          >
            <Table columns={["Token", "Classe", "Variável CSS", "Valor", "Exemplo"]}>
              {(Object.keys(insetShadow) as (keyof typeof insetShadow)[]).map((name) => (
                <tr key={name} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 text-label-md whitespace-nowrap">{name}</td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    inset-shadow-{name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Code>{cssVarName("inset-shadow", name)}</Code>
                  </td>
                  <td className="px-4 py-3">
                    <Code>{insetShadow[name]}</Code>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex gap-4">
                      <div className="h-12 w-16 rounded-lg bg-gradient-brand shadow-sm" />
                      <div
                        className="h-12 w-16 rounded-lg bg-gradient-brand"
                        style={{ boxShadow: `${vars.insetShadow[name]}, ${vars.shadow.sm}` }}
                      />
                    </div>
                    <p className="mt-2 text-body-sm text-subtle">Sem · com</p>
                  </td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Escala"
            description="Convenção: o token md vira a variável --ali-shadow-md e a classe shadow-md. No tema escuro as sombras quase não aparecem; lá a elevação vem mais da cor de fundo."
          >
            <Table columns={["Token", "Classe", "Variável CSS", "Valor", "Exemplo", "Onde usar"]}>
              {(Object.keys(shadow) as (keyof typeof shadow)[]).map((name) => (
                <tr key={name} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3 text-label-md whitespace-nowrap">{name}</td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    shadow-{name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Code>{cssVarName("shadow", name)}</Code>
                  </td>
                  <td className="px-4 py-3">
                    <Code>{shadow[name]}</Code>
                  </td>
                  <td className="px-8 py-8">
                    <div
                      className="h-12 w-16 rounded-md bg-surface-raised"
                      style={{ boxShadow: vars.shadow[name] }}
                    />
                  </td>
                  <td className="px-4 py-3 text-body-md">{scaleUsage[name]}</td>
                </tr>
              ))}
            </Table>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
