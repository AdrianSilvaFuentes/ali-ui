import type { ThemeName } from "@ali/tokens";
import { type ReactNode, useState } from "react";

function systemTheme(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Formata uma razão de contraste no padrão brasileiro: 4.5 → "4,5:1". */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1).replace(".", ",")}:1`;
}

/** Moldura das páginas de tokens: título, descrição e o botão de tema claro/escuro. */
export function TokensLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: (theme: ThemeName) => ReactNode;
}) {
  const [theme, setTheme] = useState<ThemeName>(systemTheme);
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen flex-col gap-2xl bg-background p-xl font-body text-body text-foreground"
    >
      <header className="flex flex-wrap items-end justify-between gap-md">
        <div>
          <h1 className="font-heading text-display">{title}</h1>
          <p className="mt-xs max-w-prose text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setTheme(nextTheme)}
          className="rounded-control border border-border-strong bg-surface px-md py-xs text-label transition-colors duration-fast hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro"}
        </button>
      </header>
      {children(theme)}
    </div>
  );
}

export function Section({
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

export function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-caption text-muted-foreground">{children}</code>;
}

/** Tabela com cabeçalho; as linhas vêm em `children`. */
export function Table({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-surface border border-border">
      <table className="w-full border-collapse text-left">
        <thead className="bg-muted text-label">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-md py-xs whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Amostra de cor quadrada, usada nas tabelas. */
export function Swatch({ color }: { color: string }) {
  return (
    <div
      className="size-xl shrink-0 rounded-control border border-border"
      style={{ backgroundColor: color }}
    />
  );
}
