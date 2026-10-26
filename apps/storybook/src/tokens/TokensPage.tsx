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
// Os primitivos aparecem aqui só como documentação. Componentes nunca os usam.
import { accent, gray, red } from "@ali/tokens/primitives";
import { type ReactNode, useState } from "react";

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

const primitiveScales = { gray, accent, red };

/** Formata uma razão de contraste no padrão brasileiro: 4.5 → "4,5:1". */
function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1).replace(".", ",")}:1`;
}

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

function systemTheme(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-xl">
      <h2 className="font-heading text-heading-md">{title}</h2>
      <p className="mt-2xs mb-lg max-w-prose text-body-sm text-muted-foreground">{description}</p>
      {children}
    </section>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-caption text-muted-foreground">{children}</code>;
}

export function TokensPage() {
  const [theme, setTheme] = useState<ThemeName>(systemTheme);
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen flex-col gap-2xl bg-background p-xl font-body text-body text-foreground"
    >
      <header className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <h1 className="font-heading text-display">Tokens</h1>
          <p className="mt-xs max-w-prose text-muted-foreground">
            Valores provisórios e neutros. Componentes usam apenas os tokens semânticos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          className="rounded-control border border-border-strong bg-surface px-md py-xs text-label transition-colors duration-fast hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro"}
        </button>
      </header>

      <Section
        title="Cores semânticas"
        description="Nomeadas pelo papel que cumprem. Hex e contraste mudam com o tema; o contraste é medido com a cor que acompanha o token e segue a WCAG AA."
      >
        <div className="overflow-x-auto rounded-surface border border-border">
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted text-label">
              <tr>
                <th scope="col" className="px-md py-xs">
                  Token
                </th>
                <th scope="col" className="px-md py-xs">
                  Hex
                </th>
                <th scope="col" className="px-md py-xs">
                  Contraste
                </th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(color) as ColorName[]).map((name) => (
                <tr key={name} className="border-t border-border align-top">
                  <td className="px-md py-sm">
                    <div className="flex items-start gap-sm">
                      <div
                        className="size-xl shrink-0 rounded-control border border-border"
                        style={{ backgroundColor: vars.color[name] }}
                      />
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
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Cores primitivas"
        description="A matéria-prima das cores semânticas. Só aparecem aqui como referência."
      >
        <div className="flex flex-col gap-lg">
          {Object.entries(primitiveScales).map(([scale, values]) => (
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
                className="h-sm bg-accent"
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
    </div>
  );
}
