import { contrastRatio, toHex, toOklch } from "@ali/tokens/color";
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import { blue, gray, green, orange, primary, red, yellow } from "@ali/tokens/primitives";
import { formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

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

          <Section
            title="Vermelho"
            description="Para erros e ações destrutivas. Texto branco por cima a partir do 700."
          >
            <ScaleTable name="red" scale={red} />
          </Section>

          <Section title="Verde" description="Para sucesso e confirmações.">
            <ScaleTable name="green" scale={green} />
          </Section>

          <Section title="Laranja" description="Para avisos.">
            <ScaleTable name="orange" scale={orange} />
          </Section>

          <Section title="Amarelo" description="Para destaques informativos e atenção leve.">
            <ScaleTable name="yellow" scale={yellow} />
          </Section>

          <Section title="Azul" description="Para informações.">
            <ScaleTable name="blue" scale={blue} />
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
