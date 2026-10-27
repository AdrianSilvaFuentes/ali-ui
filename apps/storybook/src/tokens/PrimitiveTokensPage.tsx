import { contrastRatio, toHex, toOklch } from "@ali/tokens/color";
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import { gray, primary, red } from "@ali/tokens/primitives";
import { Code, formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

/** Tabela de uma escala: hex, OKLCH e contraste com os fundos claro (gray-50) e escuro (gray-950). */
function ScaleTable({ name, scale }: { name: string; scale: Record<string, string> }) {
  return (
    <Table columns={["Passo", "Hex", "OKLCH", "Contraste com gray-50", "Contraste com gray-950"]}>
      {Object.entries(scale).map(([step, value]) => (
        <tr key={step} className="border-t border-border align-middle">
          <td className="px-md py-sm">
            <div className="flex items-center gap-sm">
              <Swatch color={value} />
              <span className="text-label">
                {name}-{step}
              </span>
            </div>
          </td>
          <td className="px-md py-sm font-mono text-body-sm">{toHex(value)}</td>
          <td className="px-md py-sm font-mono text-body-sm whitespace-nowrap">{toOklch(value)}</td>
          <td className="px-md py-sm font-mono text-body-sm">
            {formatRatio(contrastRatio(value, gray[50]))}
          </td>
          <td className="px-md py-sm font-mono text-body-sm">
            {formatRatio(contrastRatio(value, gray[950]))}
          </td>
        </tr>
      ))}
    </Table>
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
            description="Cinza puro nos tons claros e um leve tom frio nos escuros."
          >
            <ScaleTable name="gray" scale={gray} />
          </Section>

          <Section
            title="Cor de marca"
            description="Amarelo dourado. Como é clara, funciona como fundo com texto escuro por cima; como texto sobre fundo claro, só a partir do 900."
          >
            <ScaleTable name="primary" scale={primary} />
          </Section>

          <Section title="Erro" description="Ainda provisória: será definida com a identidade.">
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-xs">
              {Object.entries(red).map(([step, value]) => (
                <li key={step} className="flex flex-col gap-3xs">
                  <div
                    className="h-2xl rounded-control border border-border"
                    style={{ backgroundColor: value }}
                  />
                  <span className="text-caption">red-{step}</span>
                  <Code>{toHex(value)}</Code>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
