import { color, cssVarName, type GradientName, gradient, gradientCss, vars } from "@ali/tokens";
import { contrastRatio, toHex } from "@ali/tokens/color";
import { Code, formatRatio, Section, Table, TokensLayout } from "./TokensLayout";

/** Contraste do texto static-white em uma ponta do degradê. */
function StopContrast({ value }: { value: string }) {
  const ratio = contrastRatio(color["text-static-white"].light, value);
  const passes = ratio >= 4.5;
  return (
    <span className={passes ? "text-body-sm text-subtle" : "text-body-sm text-danger"}>
      {toHex(value)} · {formatRatio(ratio)} · {passes ? "passa" : "não passa"} (mín. 4,5:1)
    </span>
  );
}

export function GradientTokensPage() {
  const names = Object.keys(gradient) as GradientName[];
  return (
    <TokensLayout
      title="Gradients"
      description="Degradês da identidade, iguais nos dois temas. O texto por cima usa static-white, que também não muda com o tema."
    >
      {() => (
        <>
          <Section
            title="Tokens"
            description="Convenção: o token brand vira a variável --ali-gradient-brand e a classe bg-gradient-brand. O ângulo de 135° (contado como no CSS: 0° aponta para cima) desce do canto superior esquerdo (primeira cor) ao inferior direito (segunda)."
          >
            <Table columns={["Token", "Classe", "Variável CSS", "Cores", "Exemplo"]}>
              {names.map((name) => (
                <tr key={name} className="border-t border-subtle align-middle">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-label-md">{name}</span>
                      <span className="text-body-sm text-subtle">{gradient[name].description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
                    bg-gradient-{name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Code>{cssVarName("gradient", name)}</Code>
                  </td>
                  <td className="px-4 py-3">
                    <Code>{gradientCss(gradient[name])}</Code>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="flex h-12 w-32 items-center justify-center rounded-lg text-label-md text-static-white"
                      style={{ backgroundImage: vars.gradient[name] }}
                    >
                      Salvar
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Section>

          <Section
            title="Contraste"
            description="Texto static-white medido em cada ponta do degradê. Escolha consciente da identidade: estes degradês não atingem o mínimo da WCAG AA para texto (4,5:1)."
          >
            <Table columns={["Token", "Início", "Fim"]}>
              {names.map((name) => (
                <tr key={name} className="border-t border-subtle align-top">
                  <td className="px-4 py-3 text-label-md">{name}</td>
                  <td className="px-4 py-3">
                    <StopContrast value={gradient[name].from} />
                  </td>
                  <td className="px-4 py-3">
                    <StopContrast value={gradient[name].to} />
                  </td>
                </tr>
              ))}
            </Table>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
