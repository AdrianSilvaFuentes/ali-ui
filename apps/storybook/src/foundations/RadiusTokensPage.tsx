import { radius, vars } from "@ali/tokens";
import { Section, Table, TokensLayout, toPx } from "./TokensLayout";

export function RadiusTokensPage() {
  return (
    <TokensLayout
      title="Radius"
      description="Raios de canto: os valores padrão do Tailwind CSS 4, do reto ao totalmente arredondado."
    >
      {() => (
        <Section title="Escala" description="Use com o utilitário rounded: rounded-md.">
          <Table columns={["Token", "Classe", "Valor", "Exemplo"]}>
            {(Object.keys(radius) as (keyof typeof radius)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-md py-sm text-label whitespace-nowrap">{name}</td>
                <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">
                  rounded-{name}
                </td>
                <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">
                  {name === "full" ? "9999px (pílula)" : toPx(radius[name])}
                </td>
                <td className="px-md py-sm">
                  <div
                    className="size-2xl border border-primary-hover bg-muted"
                    style={{ borderRadius: vars.radius[name] }}
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
