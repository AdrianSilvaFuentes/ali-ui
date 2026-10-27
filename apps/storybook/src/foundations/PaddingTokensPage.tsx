import { spacing, vars } from "@ali/tokens";
import { Section, Table, TokensLayout, toPx } from "./TokensLayout";

export function PaddingTokensPage() {
  return (
    <TokensLayout
      title="Padding"
      description="Preenchimento interno dos elementos. Por enquanto usa a mesma escala de Spacing."
    >
      {() => (
        <Section
          title="Escala"
          description="Use o nome com os utilitários de padding: p-md, px-sm, py-xs, pt-lg."
        >
          <Table columns={["Token", "Valor", "Exemplo"]}>
            {(Object.keys(spacing) as (keyof typeof spacing)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-md py-sm text-label whitespace-nowrap">p-{name}</td>
                <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">
                  {spacing[name]} · {toPx(spacing[name])}
                </td>
                <td className="px-md py-sm">
                  {/* A área colorida é o padding; o conteúdo fica no centro. */}
                  <div
                    className="inline-flex rounded-control bg-primary"
                    style={{ padding: vars.space[name] }}
                  >
                    <span className="rounded-control bg-surface px-xs text-caption">Conteúdo</span>
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
