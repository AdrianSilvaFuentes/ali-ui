import { shadow, vars } from "@ali/tokens";
import { Code, Section, Table, TokensLayout } from "./TokensLayout";

export function ShadowTokensPage() {
  return (
    <TokensLayout
      title="Shadow elevations"
      description="Sombras por nível de elevação: os valores padrão do Tailwind CSS 4, sem alterações."
    >
      {() => (
        <Section
          title="Escala"
          description="Use com o utilitário shadow: shadow-md. No tema escuro as sombras quase não aparecem; lá a elevação vem mais da cor de fundo."
        >
          <Table columns={["Token", "Classe", "Valor", "Exemplo"]}>
            {(Object.keys(shadow) as (keyof typeof shadow)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label whitespace-nowrap">{name}</td>
                <td className="px-4 py-3 font-mono text-body-sm whitespace-nowrap">
                  shadow-{name}
                </td>
                <td className="px-4 py-3">
                  <Code>{shadow[name]}</Code>
                </td>
                <td className="px-8 py-8">
                  <div
                    className="h-12 w-16 rounded-md bg-surface"
                    style={{ boxShadow: vars.shadow[name] }}
                  />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
