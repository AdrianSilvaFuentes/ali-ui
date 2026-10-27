import { radius, vars } from "@ali/tokens";
import { Section, Table, TokensLayout, toPx } from "./TokensLayout";

const usage: Record<keyof typeof radius, string> = {
  control: "Botões, campos e controles.",
  surface: "Cartões, menus e diálogos.",
  pill: "Etiquetas e elementos totalmente arredondados.",
};

export function RadiusTokensPage() {
  return (
    <TokensLayout
      title="Radius"
      description="Cantos discretos, por tipo de elemento. Sem cantos muito arredondados."
    >
      {() => (
        <Section title="Escala" description="Use com o utilitário rounded: rounded-control.">
          <Table columns={["Token", "Valor", "Uso", "Exemplo"]}>
            {(Object.keys(radius) as (keyof typeof radius)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-md py-sm text-label whitespace-nowrap">rounded-{name}</td>
                <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">
                  {radius[name].endsWith("rem")
                    ? `${radius[name]} · ${toPx(radius[name])}`
                    : radius[name]}
                </td>
                <td className="px-md py-sm text-body-sm text-muted-foreground">{usage[name]}</td>
                <td className="px-md py-sm">
                  <div
                    className="h-2xl w-3xl border border-border-strong bg-muted"
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
