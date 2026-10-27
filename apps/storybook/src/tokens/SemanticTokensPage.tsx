import {
  type ColorName,
  color,
  contrastPairs,
  duration,
  font,
  radius,
  spacing,
  type ThemeName,
  text,
  vars,
} from "@ali/tokens";
import { contrastRatio, toHex } from "@ali/tokens/color";
import { Code, formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

// O Tailwind só gera classes escritas por extenso no código, por isso a lista explícita.
const textClass: Record<keyof typeof text, string> = {
  caption: "text-caption",
  label: "text-label",
  "body-sm": "text-body-sm",
  body: "text-body",
  "body-lg": "text-body-lg",
  "heading-sm": "text-heading-sm",
  "heading-md": "text-heading-md",
  "heading-lg": "text-heading-lg",
  display: "text-display",
};

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

export function SemanticTokensPage() {
  return (
    <TokensLayout
      title="Semânticos"
      description="Os nomes que os componentes usam, definidos pelo papel de cada valor. Valores ainda provisórios."
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

          <Section
            title="Tipografia"
            description="Estilos de texto com tamanho, altura de linha e peso combinados. As fontes ainda são as do sistema."
          >
            <ul className="flex flex-col gap-md">
              {Object.entries(text).map(([name, style]) => (
                <li
                  key={name}
                  className="grid gap-2xs border-b border-border pb-md sm:grid-cols-[12rem_1fr]"
                >
                  <div className="flex flex-col">
                    <span className="text-label">text-{name}</span>
                    <Code>
                      {style.fontSize} · {style.lineHeight} · {style.fontWeight}
                    </Code>
                  </div>
                  <p className={textClass[name as keyof typeof text]}>
                    Um sistema enxuto, com poucos componentes e muita personalidade.
                  </p>
                </li>
              ))}
            </ul>
            <ul className="mt-lg flex flex-col gap-xs">
              {Object.entries(font).map(([name, value]) => (
                <li key={name} className="flex flex-wrap items-baseline gap-sm">
                  <span className="text-label">font-{name}</span>
                  <Code>{value}</Code>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Espaçamento"
            description="Usado em margens, preenchimentos e distâncias entre elementos. Ex.: p-md, gap-xs, mt-lg."
          >
            <ul className="flex flex-col gap-xs">
              {Object.entries(spacing).map(([name, value]) => (
                <li key={name} className="grid grid-cols-[4rem_5rem_1fr] items-center gap-sm">
                  <span className="text-label">{name}</span>
                  <Code>{value}</Code>
                  <div
                    className="h-sm bg-primary"
                    style={{ width: vars.space[name as keyof typeof spacing] }}
                  />
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Raios e durações"
            description="Cantos discretos e animações curtas. Ex.: rounded-control, duration-fast."
          >
            <div className="flex flex-wrap gap-2xl">
              <ul className="flex flex-wrap gap-lg">
                {Object.entries(radius).map(([name, value]) => (
                  <li key={name} className="flex flex-col gap-2xs">
                    <div
                      className="size-3xl border border-border-strong bg-muted"
                      style={{ borderRadius: vars.radius[name as keyof typeof radius] }}
                    />
                    <span className="text-label">rounded-{name}</span>
                    <Code>{value}</Code>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-xs">
                {Object.entries(duration).map(([name, value]) => (
                  <li key={name} className="flex items-baseline gap-sm">
                    <span className="text-label">duration-{name}</span>
                    <Code>{value}</Code>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </>
      )}
    </TokensLayout>
  );
}
