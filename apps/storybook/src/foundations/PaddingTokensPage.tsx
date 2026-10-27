import { cssVarName, spacing, vars } from "@ali/tokens";
import { Code, Section, spacingSteps, Table, TokensLayout, toPx } from "./TokensLayout";

// Utilitários de padding do Tailwind e os lados que cada um preenche.
const variants = [
  ["p-4", "Todos os lados"],
  ["px-4", "Esquerda e direita"],
  ["py-4", "Em cima e embaixo"],
  ["pt-4", "Em cima"],
  ["pr-4", "Direita"],
  ["pb-4", "Embaixo"],
  ["pl-4", "Esquerda"],
  ["ps-4", "Início da linha (esquerda em português, direita em árabe)"],
  ["pe-4", "Fim da linha"],
] as const;

export function PaddingTokensPage() {
  return (
    <TokensLayout
      title="Padding"
      description="Padding não tem tokens próprios: é a escala de Spacing aplicada como preenchimento interno."
    >
      {() => (
        <>
          <Section
            title="Como usar"
            description="Escolha o lado com o utilitário e o tamanho com um passo da escala de Spacing. A variável CSS é sempre a do Spacing: p-4 usa --ali-spacing-4."
          >
            <Table columns={["Classe", "Preenche"]}>
              {variants.map(([className, sides]) => (
                <tr key={className} className="border-t border-border align-middle">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Code>{className}</Code>
                  </td>
                  <td className="px-4 py-2 text-body-sm">{sides}</td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Escala"
            description="Os mesmos passos de Spacing, aplicados como padding."
          >
            <Table columns={["Classe", "Valor", "Variável CSS", "Exemplo"]}>
              {spacingSteps.map((name) => (
                <tr key={name} className="border-t border-border align-middle">
                  <td className="px-4 py-2 text-label whitespace-nowrap">p-{name}</td>
                  <td className="px-4 py-2 font-mono text-body-sm whitespace-nowrap">
                    {toPx(spacing[name])}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Code>{cssVarName("spacing", name)}</Code>
                  </td>
                  <td className="px-4 py-2">
                    {/* A área colorida é o padding; o conteúdo fica no centro. */}
                    <div
                      className="inline-flex rounded-sm bg-primary"
                      style={{ padding: vars.spacing[name] }}
                    >
                      <span className="rounded-sm bg-surface-raised px-2 text-caption">
                        Conteúdo
                      </span>
                    </div>
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
