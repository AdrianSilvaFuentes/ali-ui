import { contrastRatio, toHex, toOklch } from "@ali/tokens/color";
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import { accent, gray, red } from "@ali/tokens/primitives";
import { Code, formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

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
            <Table columns={["Passo", "Hex", "OKLCH", "Contraste com 50", "Contraste com 950"]}>
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
