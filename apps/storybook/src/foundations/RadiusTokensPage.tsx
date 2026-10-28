import { cssVarName, radius, vars } from "@ali/tokens";
import { Code, Section, Table, TokensLayout, toPx } from "./TokensLayout";

export function RadiusTokensPage() {
  return (
    <TokensLayout
      title="Radius"
      description="Raios de canto: os valores padrão do Tailwind CSS 4, do reto ao totalmente arredondado."
    >
      {() => (
        <Section
          title="Escala"
          description="Convenção: o token md vira a variável --ali-radius-md e a classe rounded-md."
        >
          <Table columns={["Token", "Classe", "Variável CSS", "Valor", "Exemplo"]}>
            {(Object.keys(radius) as (keyof typeof radius)[]).map((name) => (
              <tr key={name} className="border-t border-subtle align-middle">
                <td className="px-4 py-3 text-label-md whitespace-nowrap">{name}</td>
                <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                  rounded-{name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Code>{cssVarName("radius", name)}</Code>
                </td>
                <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                  {name === "full" ? "9999px (pílula)" : toPx(radius[name])}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="size-12 border border-default bg-surface-sunken"
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
