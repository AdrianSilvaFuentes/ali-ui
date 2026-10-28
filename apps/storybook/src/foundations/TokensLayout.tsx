import { spacing, type ThemeName } from "@ali/tokens";
import type { ReactNode } from "react";
import { useTheme } from "../theme";

/** Formata uma razão de contraste no padrão brasileiro: 4.5 → "4,5:1". */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1).replace(".", ",")}:1`;
}

/** Converte rem em pixels (base de 16px): "0.75rem" → "12px". Outros valores ficam como estão. */
export function toPx(value: string): string {
  return value.endsWith("rem") ? `${Number.parseFloat(value) * 16}px` : value;
}

/**
 * Passos de espaçamento do menor para o maior. O JavaScript põe chaves inteiras
 * ("1", "2"...) antes das outras ("px", "0.5"...), então a ordem é refeita aqui.
 */
export const spacingSteps = (Object.keys(spacing) as (keyof typeof spacing)[]).sort(
  (a, b) => (a === "px" ? 0.25 : Number(a)) - (b === "px" ? 0.25 : Number(b)),
);

/** Moldura das páginas de tokens: título e descrição. O tema vem da barra de ferramentas. */
export function TokensLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: (theme: ThemeName) => ReactNode;
}) {
  const theme = useTheme();

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen flex-col gap-12 bg-surface-sunken p-8 text-body-lg text-default"
    >
      <header>
        <h1 className="text-display">{title}</h1>
        <p className="mt-2 max-w-prose text-subtle">{description}</p>
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
    <section className="border-t border-subtle pt-8">
      <h2 className="text-title-md">{title}</h2>
      <p className="mt-1 mb-6 max-w-prose text-body-md text-subtle">{description}</p>
      {children}
    </section>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-body-sm text-subtle">{children}</code>;
}

/**
 * Tabela com cabeçalho; as linhas vêm em `children`. Com `widths`, as colunas têm
 * largura fixa, para alinhar várias tabelas iguais na mesma página.
 */
export function Table({
  columns,
  widths,
  children,
}: {
  columns: string[];
  widths?: (string | undefined)[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-subtle bg-surface shadow-xs">
      <table className={`w-full border-collapse text-left ${widths ? "table-fixed" : ""}`}>
        {widths && (
          <colgroup>
            {columns.map((column, index) => (
              <col key={column} style={{ width: widths[index] }} />
            ))}
          </colgroup>
        )}
        <thead className="bg-surface-sunken text-label-md">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2 whitespace-nowrap">
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
      className="size-8 shrink-0 rounded-sm border border-subtle"
      style={{ backgroundColor: color }}
    />
  );
}

/** Página de uma parte da fundação que ainda não tem tokens. */
export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <TokensLayout title={title} description={description}>
      {() => (
        <Section
          title="Ainda sem tokens"
          description="Esta página ganha conteúdo quando os tokens forem definidos."
        >
          <p className="max-w-prose rounded-md border border-subtle bg-surface-raised p-4 text-body-md text-subtle">
            Nada definido por enquanto.
          </p>
        </Section>
      )}
    </TokensLayout>
  );
}
