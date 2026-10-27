import { type ColorName, color, contrastPairs, type ThemeName, vars } from "@ali/tokens";
import { contrastRatio, toHex } from "@ali/tokens/color";
import { formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

function ContrastCell({ name, theme }: { name: ColorName; theme: ThemeName }) {
  const pair = contrastPairs.find(([fg, bg]) => fg === name || bg === name);
  if (!pair) {
    return <span className="text-body-sm text-muted-foreground">Decorativa, sem mínimo</span>;
  }
  const [fg, bg, min] = pair;
  const other = fg === name ? bg : fg;
  const ratio = contrastRatio(color[fg][theme], color[bg][theme]);
  const passes = ratio >= min;
  return (
    <div className="flex flex-col">
      <span className="font-mono text-body-sm">
        {formatRatio(ratio)} <span className="text-muted-foreground">com {other}</span>
      </span>
      <span className={passes ? "text-caption text-muted-foreground" : "text-caption text-danger"}>
        {passes ? "Passa" : "Não passa"} · mínimo {formatRatio(min)}
      </span>
    </div>
  );
}

export function ColorTokensPage() {
  return (
    <TokensLayout
      title="Cores"
      description="Cores semânticas: os nomes que os componentes usam, definidos pelo papel de cada valor."
    >
      {(theme) => (
        <>
          <Section
            title="Cores semânticas"
            description="Nomeadas pelo papel que cumprem. Hex e contraste mudam com o tema; o contraste é medido com a cor que acompanha o token e segue a WCAG AA."
          >
            <Table columns={["Token", "Hex", "Contraste"]}>
              {(Object.keys(color) as ColorName[]).map((name) => (
                <tr key={name} className="border-t border-border align-top">
                  <td className="px-md py-sm">
                    <div className="flex items-start gap-sm">
                      <Swatch color={vars.color[name]} />
                      <div className="flex flex-col">
                        <span className="text-label">{name}</span>
                        <span className="text-caption text-muted-foreground">
                          {color[name].description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-sm">
                    <span className="font-mono text-body-sm">{toHex(color[name][theme])}</span>
                  </td>
                  <td className="px-md py-sm">
                    <ContrastCell name={name} theme={theme} />
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
