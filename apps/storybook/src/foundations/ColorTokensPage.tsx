import { type ColorName, color, contrastPairs, type ThemeName } from "@ali/tokens";
import { contrastRatio, toHex } from "@ali/tokens/color";
// Os primitivos aparecem aqui só para mostrar de onde vem cada cor. Componentes nunca os usam.
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
import type { ReactNode } from "react";
import { formatRatio, Section, Swatch, Table, TokensLayout } from "./TokensLayout";

/** Contraste do token no tema, em uma linha. */
function ContrastLine({ name, theme }: { name: ColorName; theme: ThemeName }) {
  const pair = contrastPairs.find(([fg, bg]) => fg === name || bg === name);
  if (!pair) {
    return <span className="text-body-sm text-subtle">Decorativa, sem mínimo</span>;
  }
  const [fg, bg, min] = pair;
  const other = fg === name ? bg : fg;
  const ratio = contrastRatio(color[fg][theme], color[bg][theme]);
  const passes = ratio >= min;
  return (
    <span className={passes ? "text-body-sm text-subtle" : "text-body-sm text-danger"}>
      {formatRatio(ratio)} com {other} · {passes ? "passa" : "não passa"} (mín. {formatRatio(min)})
    </span>
  );
}

/** Nome do primitivo de onde vem um valor, como "neutral-light-50". */
function primitiveName(value: string): string {
  for (const [scale, steps] of Object.entries(scales)) {
    const step = Object.entries(steps).find(([, v]) => v === value)?.[0];
    if (step) return `${scale}-${step}`;
  }
  return value;
}

/** Célula de um tema: amostra, primitivo, hex e contraste. */
function ThemeCell({ name, theme }: { name: ColorName; theme: ThemeName }) {
  const value = color[name][theme];
  return (
    <div className="flex items-start gap-3">
      <Swatch color={value} />
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-body-md">{primitiveName(value)}</span>
        <span className="font-mono text-body-sm text-subtle">{toHex(value)}</span>
        <ContrastLine name={name} theme={theme} />
      </div>
    </div>
  );
}

const scales = {
  "neutral-light": neutralLight,
  "neutral-dark": neutralDark,
  primary,
  red,
  green,
  orange,
  yellow,
  blue,
};

/** Classes do Tailwind de um token de cor; cada grupo vale só para o seu utilitário. */
function classesFor(name: ColorName): string {
  if (name.startsWith("surface")) return `bg-${name}`;
  if (name.startsWith("text-")) return name;
  if (name.startsWith("icon-")) return `text-${name}`;
  if (name.startsWith("border-")) {
    const short = name.slice(7);
    return `border-${short} · outline-${short} · ring-${short}`;
  }
  return `bg-${name} · text-${name}`;
}

/** Páginas de cor no Storybook. */
export type ColorGroup = "surface" | "text" | "icon" | "border" | "semantic";

/**
 * Em que página cada token de cor aparece. Um token novo sem página aqui é um erro
 * de tipo, então nenhum fica de fora da documentação.
 */
const colorGroup = {
  "surface-sunken": "surface",
  surface: "surface",
  "surface-raised": "surface",
  "surface-overlay": "surface",
  "text-default": "text",
  "text-subtle": "text",
  "text-disabled": "text",
  "text-link": "text",
  "icon-default": "icon",
  "icon-subtle": "icon",
  "icon-disabled": "icon",
  "border-default": "border",
  "border-strong": "border",
  "border-focus": "border",
  danger: "semantic",
  "danger-foreground": "semantic",
} as const satisfies Record<ColorName, ColorGroup>;

/** Tabela Token · Hex · Contraste com os tokens de cor de uma página. */
export function ColorGroupPage({
  group,
  title,
  description,
  children,
}: {
  group: ColorGroup;
  title: string;
  description: string;
  /** Conteúdo extra mostrado depois da tabela, como uma demonstração. */
  children?: ReactNode;
}) {
  const names = (Object.keys(colorGroup) as ColorName[]).filter(
    (name) => colorGroup[name] === group,
  );
  return (
    <TokensLayout title={title} description={description}>
      {() => (
        <>
          <Section
            title="Tokens"
            description="Cada token tem um primitivo no tema claro e outro no escuro. O contraste é medido com a cor que acompanha o token e segue a WCAG AA."
          >
            <Table columns={["Token", "Light", "Dark"]}>
              {names.map((name) => (
                <tr key={name} className="border-t border-default align-top">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-label-md">{name}</span>
                      <code className="font-mono text-body-sm text-subtle">{classesFor(name)}</code>
                      <span className="text-body-sm text-subtle">{color[name].description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ThemeCell name={name} theme="light" />
                  </td>
                  <td className="px-4 py-3">
                    <ThemeCell name={name} theme="dark" />
                  </td>
                </tr>
              ))}
            </Table>
          </Section>
          {children}
        </>
      )}
    </TokensLayout>
  );
}
