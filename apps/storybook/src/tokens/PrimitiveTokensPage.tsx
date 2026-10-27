import { type ColorName, color } from "@ali/tokens";
import { contrastRatio, toHex, toOklch } from "@ali/tokens/color";
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import { accent, gray, red } from "@ali/tokens/primitives";
import { Code, formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

/** Tokens semânticos que usam um valor primitivo, separados por tema. */
function usedBy(value: string): { light: ColorName[]; dark: ColorName[] } {
  const names = Object.keys(color) as ColorName[];
  return {
    light: names.filter((name) => color[name].light === value),
    dark: names.filter((name) => color[name].dark === value),
  };
}

function UsageCell({ value }: { value: string }) {
  const { light, dark } = usedBy(value);
  if (light.length === 0 && dark.length === 0) {
    return <span className="text-body-sm text-muted-foreground">Sem uso</span>;
  }
  return (
    <div className="flex flex-col gap-3xs text-body-sm">
      {light.length > 0 && (
        <span>
          <span className="text-muted-foreground">Claro:</span> {light.join(", ")}
        </span>
      )}
      {dark.length > 0 && (
        <span>
          <span className="text-muted-foreground">Escuro:</span> {dark.join(", ")}
        </span>
      )}
    </div>
  );
}

export function PrimitiveTokensPage() {
  return (
    <TokensLayout
      title="Primitivos"
      description="A matéria-prima dos tokens semânticos. Componentes nunca usam estes valores diretamente."
    >
      {() => (
        <>
          <Section
            title="Escala de cinzas"
            description="Cinza puro nos tons claros e um leve tom frio nos escuros. O contraste é medido com o fundo claro (50) e com o fundo escuro (950)."
          >
            <Table
              columns={[
                "Passo",
                "Hex",
                "OKLCH",
                "Contraste com 50",
                "Contraste com 950",
                "Usado em",
              ]}
            >
              {Object.entries(gray).map(([step, value]) => (
                <tr key={step} className="border-t border-border align-middle">
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <Swatch color={value} />
                      <span className="text-label">gray-{step}</span>
                    </div>
                  </td>
                  <td className="px-md py-sm font-mono text-body-sm">{toHex(value)}</td>
                  <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">
                    {toOklch(value)}
                  </td>
                  <td className="px-md py-sm font-mono text-body-sm">
                    {formatRatio(contrastRatio(value, gray[50]))}
                  </td>
                  <td className="px-md py-sm font-mono text-body-sm">
                    {formatRatio(contrastRatio(value, gray[950]))}
                  </td>
                  <td className="px-md py-sm">
                    <UsageCell value={value} />
                  </td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Destaque e erro"
            description="Ainda provisórias: serão definidas com a identidade."
          >
            <div className="flex flex-col gap-lg">
              {Object.entries({ accent, red }).map(([scale, values]) => (
                <div key={scale}>
                  <h3 className="mb-xs text-label">{scale}</h3>
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-xs">
                    {Object.entries(values).map(([step, value]) => (
                      <li key={step} className="flex flex-col gap-3xs">
                        <div
                          className="h-2xl rounded-control border border-border"
                          style={{ backgroundColor: value }}
                        />
                        <span className="text-caption">{step}</span>
                        <Code>{toHex(value)}</Code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
