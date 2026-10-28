import { cssVarName, elevation, shadow, vars } from "@ali/tokens";
import { Code, Section, Table, TokensLayout } from "./TokensLayout";

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
            <Table columns={["Token", "Classe", "Variável CSS", "Equivale a", "Use com"]}>
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
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Escala"
            description="Convenção: o token md vira a variável --ali-shadow-md e a classe shadow-md. No tema escuro as sombras quase não aparecem; lá a elevação vem mais da cor de fundo."
          >
            <Table columns={["Token", "Classe", "Variável CSS", "Valor", "Exemplo"]}>
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
                </tr>
              ))}
            </Table>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
