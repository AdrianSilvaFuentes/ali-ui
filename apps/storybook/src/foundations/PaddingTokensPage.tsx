import { spacing, vars } from "@ali/tokens";
import { Section, spacingSteps, Table, TokensLayout, toPx } from "./TokensLayout";

export function PaddingTokensPage() {
  return (
    <TokensLayout
      title="Padding"
      description="Preenchimento interno dos elementos. Por enquanto usa a mesma escala de Spacing."
    >
      {() => (
        <Section
          title="Escala"
          description="Use o nome com os utilitários de padding: p-4, px-3, py-2, pt-6."
        >
          <Table columns={["Token", "Valor", "Exemplo"]}>
            {spacingSteps.map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label whitespace-nowrap">p-{name}</td>
                <td className="px-4 py-3 font-mono text-body-sm whitespace-nowrap">
                  {spacing[name]} · {toPx(spacing[name])}
                </td>
                <td className="px-4 py-3">
                  {/* A área colorida é o padding; o conteúdo fica no centro. */}
                  <div
                    className="inline-flex rounded-sm bg-primary"
                    style={{ padding: vars.space[name] }}
                  >
                    <span className="rounded-sm bg-surface px-2 text-caption">Conteúdo</span>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
