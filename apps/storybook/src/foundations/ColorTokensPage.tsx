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

/** Páginas de cor no Storybook. */
export type ColorGroup = "surface" | "text" | "border" | "semantic";

/**
 * Em que página cada token de cor aparece. Um token novo sem página aqui é um erro
 * de tipo, então nenhum fica de fora da documentação.
 */
const colorGroup = {
  background: "surface",
  surface: "surface",
  muted: "surface",
  primary: "surface",
  "primary-hover": "surface",
  foreground: "text",
  "muted-foreground": "text",
  link: "text",
  "primary-foreground": "text",
  border: "border",
  "border-strong": "border",
  "focus-ring": "border",
  danger: "semantic",
  "danger-foreground": "semantic",
} as const satisfies Record<ColorName, ColorGroup>;

/** Tabela Token · Hex · Contraste com os tokens de cor de uma página. */
export function ColorGroupPage({
  group,
  title,
  description,
}: {
  group: ColorGroup;
  title: string;
  description: string;
}) {
  const names = (Object.keys(colorGroup) as ColorName[]).filter(
    (name) => colorGroup[name] === group,
  );
  return (
    <TokensLayout title={title} description={description}>
      {(theme) => (
        <Section
          title="Tokens"
          description="Hex e contraste mudam com o tema. O contraste é medido com a cor que acompanha o token e segue a WCAG AA."
        >
          <Table columns={["Token", "Hex", "Contraste"]}>
            {names.map((name) => (
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
      )}
    </TokensLayout>
  );
}
