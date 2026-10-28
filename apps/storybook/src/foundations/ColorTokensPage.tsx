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
    const text = name.includes("static")
      ? "Depende do fundo: sobre imagens, use uma camada por baixo"
      : "Decorativa, sem mínimo";
    return <span className="text-body-sm text-subtle">{text}</span>;
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
export type ColorGroup =
  | "surface"
  | "text"
  | "text-status"
  | "text-special"
  | "icon"
  | "icon-status"
  | "icon-special"
  | "border"
  | "border-status";

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
  "text-inverse": "text-special",
  "text-static-white": "text-special",
  "text-static-black": "text-special",
  "icon-default": "icon",
  "icon-subtle": "icon",
  "icon-disabled": "icon",
  "icon-inverse": "icon-special",
  "icon-static-white": "icon-special",
  "icon-static-black": "icon-special",
  "icon-success": "icon-status",
  "icon-caution": "icon-status",
  "icon-warning": "icon-status",
  "icon-danger": "icon-status",
  "icon-info": "icon-status",
  "border-default": "border",
  "border-subtle": "border",
  "border-disabled": "border",
  "border-focus": "border",
  "border-success": "border-status",
  "border-caution": "border-status",
  "border-warning": "border-status",
  "border-danger": "border-status",
  "border-info": "border-status",
  "text-success": "text-status",
  "text-caution": "text-status",
  "text-warning": "text-status",
  "text-danger": "text-status",
  "text-info": "text-status",
} as const satisfies Record<ColorName, ColorGroup>;

/** Tabela Token · Light · Dark com os tokens de cor de um grupo. */
export function ColorTable({ group }: { group: ColorGroup }) {
  const names = (Object.keys(colorGroup) as ColorName[]).filter(
    (name) => colorGroup[name] === group,
  );
  return (
    <Table columns={["Token", "Light", "Dark"]}>
      {names.map((name) => (
        <tr key={name} className="border-t border-subtle align-top">
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
  );
}

/** Página de um grupo de cores: a tabela de tokens e, depois, conteúdo extra. */
export function ColorGroupPage({
  group,
  title,
  description,
  children,
}: {
  group: ColorGroup;
  title: string;
  description: string;
  /** Conteúdo extra mostrado depois da tabela, como outra tabela ou uma demonstração. */
  children?: ReactNode;
}) {
  return (
    <TokensLayout title={title} description={description}>
      {() => (
        <>
          <Section
            title="Tokens"
            description="Cada token tem um primitivo no tema claro e outro no escuro. O contraste é medido com a cor que acompanha o token e segue a WCAG AA."
          >
            <ColorTable group={group} />
          </Section>
          {children}
        </>
      )}
    </TokensLayout>
  );
}
