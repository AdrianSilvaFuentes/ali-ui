import { cssVarName, spacing, vars } from "@ali/tokens";
import { Code, Section, spacingSteps, Table, TokensLayout, toPx } from "./TokensLayout";

export function SpacingTokensPage() {
  return (
    <TokensLayout
      title="Spacing"
      description="Escala de espaçamento do Tailwind CSS 4: cada passo vale 4px e px vale 1px. Serve para padding, margin, gap e tamanhos."
    >
      {() => (
        <Section
          title="Escala"
          description="Convenção: o token 4 vira a variável --ali-spacing-4 e as classes p-4, gap-4, w-4. Valores fora da escala, como p-13, não existem."
        >
          <Table columns={["Token", "px", "rem", "Variável CSS", "Exemplos de classe", "Visual"]}>
            {spacingSteps.map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-2 text-label whitespace-nowrap">{name}</td>
                <td className="px-4 py-2 font-mono text-body-sm">{toPx(spacing[name])}</td>
                <td className="px-4 py-2 font-mono text-body-sm">{spacing[name]}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Code>{cssVarName("spacing", name)}</Code>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Code>
                    p-{name} · gap-{name} · w-{name}
                  </Code>
                </td>
                <td className="w-full px-4 py-2">
                  <div className="h-3 bg-primary" style={{ width: vars.spacing[name] }} />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
