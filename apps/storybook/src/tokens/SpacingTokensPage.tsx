import { spacing, vars } from "@ali/tokens";
import { Section, Table, TokensLayout, toPx } from "./TokensLayout";

export function SpacingTokensPage() {
  return (
    <TokensLayout
      title="Espaçamento"
      description="Margens, preenchimentos e distâncias entre elementos, em tamanhos de camiseta."
    >
      {() => (
        <Section
          title="Escala"
          description="Use o nome com qualquer utilitário de espaço: p-md, px-sm, gap-xs, mt-lg."
        >
          <Table columns={["Token", "rem", "px", "Visual"]}>
            {(Object.keys(spacing) as (keyof typeof spacing)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-md py-sm text-label whitespace-nowrap">{name}</td>
                <td className="px-md py-sm font-mono text-body-sm">{spacing[name]}</td>
                <td className="px-md py-sm font-mono text-body-sm">{toPx(spacing[name])}</td>
                <td className="w-full px-md py-sm">
                  <div className="h-sm bg-primary" style={{ width: vars.space[name] }} />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
