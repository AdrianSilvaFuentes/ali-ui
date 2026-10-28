import { contrastRatio, toHex, toOklch } from "@ali/tokens/color";
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import {
  blue,
  green,
  neutralDark,
  neutralLight,
  orange,
  primary,
  red,
  yellow,
} from "@ali/tokens/primitives";
import { formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

/** Tabela de uma escala: hex, OKLCH e contraste com o fundo claro (neutral-light-50) e o escuro (neutral-dark-950). */
function ScaleTable({ name, scale }: { name: string; scale: Record<string, string> }) {
  return (
    <Table
      columns={[
        "Passo",
        "Hex",
        "OKLCH",
        "Contraste com neutral-light-50",
        "Contraste com neutral-dark-950",
      ]}
    >
      {Object.entries(scale).map(([step, value]) => (
        <tr key={step} className="border-t border-subtle align-middle">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Swatch color={value} />
              <span className="text-label-md">
                {name}-{step}
              </span>
            </div>
          </td>
          <td className="px-4 py-3 font-mono text-body-md">{toHex(value)}</td>
          <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">{toOklch(value)}</td>
          <td className="px-4 py-3 font-mono text-body-md">
            {formatRatio(contrastRatio(value, neutralLight[50]))}
          </td>
          <td className="px-4 py-3 font-mono text-body-md">
            {formatRatio(contrastRatio(value, neutralDark[950]))}
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function PrimitiveTokensPage() {
  return (
    <TokensLayout
      title="Primitive"
      description="A matéria-prima dos tokens semânticos. Componentes nunca usam estes valores diretamente."
    >
      {() => (
        <>
          <Section
            title="Neutros do tema claro"
            description="Cinza puro nos tons claros e um leve tom frio nos escuros."
          >
            <ScaleTable name="neutral-light" scale={neutralLight} />
          </Section>

          <Section title="Neutros do tema escuro" description="Cinzas azulados para a versão dark.">
            <ScaleTable name="neutral-dark" scale={neutralDark} />
          </Section>

          <Section
            title="Cor de marca"
            description="Verde-menta. Como é clara, funciona como fundo com texto escuro por cima; como texto sobre fundo claro, só a partir do 900."
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
