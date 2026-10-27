import { spacing, vars } from "@ali/tokens";
import { Section, spacingSteps, Table, TokensLayout, toPx } from "./TokensLayout";

export function SpacingTokensPage() {
  return (
    <TokensLayout
      title="Spacing"
      description="Escala de espaçamento do Tailwind CSS 4: cada passo vale 4px e px vale 1px. Serve para padding, margin, gap e tamanhos."
    >
      {() => (
        <Section
          title="Escala"
          description="Valores fora da escala, como p-13, não existem. Para medidas fixas, use sempre um destes passos."
        >
          <Table columns={["Token", "px", "rem", "Exemplos de classe", "Visual"]}>
            {spacingSteps.map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-2 text-label whitespace-nowrap">{name}</td>
                <td className="px-4 py-2 font-mono text-body-sm">{toPx(spacing[name])}</td>
                <td className="px-4 py-2 font-mono text-body-sm">{spacing[name]}</td>
                <td className="px-4 py-2 font-mono text-caption text-muted-foreground whitespace-nowrap">
                  p-{name} · gap-{name} · w-{name}
                </td>
                <td className="w-full px-4 py-2">
                  <div className="h-3 bg-primary" style={{ width: vars.space[name] }} />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
