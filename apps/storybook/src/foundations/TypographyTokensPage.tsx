import { font, fontWeight, text } from "@ali/tokens";
import { Code, Section, Table, TokensLayout, toPx } from "./TokensLayout";

// O Tailwind só gera classes escritas por extenso no código, por isso as listas explícitas.
const textClass: Record<keyof typeof text, string> = {
  "body-xs": "text-body-xs",
  "body-sm": "text-body-sm",
  "body-md": "text-body-md",
  "body-lg": "text-body-lg",
  "label-xs": "text-label-xs",
  "label-sm": "text-label-sm",
  "label-md": "text-label-md",
  "label-lg": "text-label-lg",
  "title-sm": "text-title-sm",
  "title-md": "text-title-md",
  "title-lg": "text-title-lg",
  display: "text-display",
};

const weightClass: Record<keyof typeof fontWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  strong: "font-strong",
};

/** Nome usual de cada peso de fonte. */
const weightName: Record<string, string> = {
  "100": "Thin",
  "200": "ExtraLight",
  "300": "Light",
  "400": "Regular",
  "500": "Medium",
  "600": "SemiBold",
  "700": "Bold",
  "800": "ExtraBold",
  "900": "Black",
};

/** Altura de linha ou espaçamento em em como porcentagem: "1.5" → "150%", "-0.02em" → "-2%". */
function toPercent(value: string): string {
  return `${Math.round(Number.parseFloat(value) * 1000) / 10}%`;
}

// Estilos de texto do maior para o menor.
const textStylesBySize = (Object.keys(text) as (keyof typeof text)[]).sort(
  (a, b) => Number.parseFloat(text[b].fontSize) - Number.parseFloat(text[a].fontSize),
);

const sample = "Um sistema enxuto, com poucos componentes e muita personalidade.";

/** Grupos de estilos de texto, na ordem da página. O grupo vem do começo do nome. */
const textGroups = [
  ["display", "Display", "Textos de impacto: capas e chamadas principais."],
  ["title", "Title", "Títulos de páginas, seções e cartões."],
  [
    "body",
    "Body",
    "Texto corrido: parágrafos, conteúdo, legendas e textos de ajuda. O xs (10px) só em casos muito pontuais, como contadores; nunca em frases.",
  ],
  [
    "label",
    "Label",
    "Rótulos de campos, botões, abas e menus. O xs (10px) só em casos muito pontuais, como etiquetas compactas.",
  ],
] as const;

function TextStyleTable({ names }: { names: (keyof typeof text)[] }) {
  return (
    <Table
      columns={["Token", "Size (px)", "Peso", "Altura de linha", "Letter spacing", "Preview"]}
      // A última coluna (Preview) fica com o espaço que sobrar.
      widths={["10rem", "7rem", "10rem", "9rem", "8rem", undefined]}
    >
      {names.map((name) => (
        <tr key={name} className="border-t border-border align-middle">
          <td className="px-4 py-3 text-label-md whitespace-nowrap">text-{name}</td>
          <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
            {toPx(text[name].fontSize)}
          </td>
          <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
            {weightName[text[name].fontWeight] ?? text[name].fontWeight} · {text[name].fontWeight}
          </td>
          <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
            {text[name].lineHeight} ({toPercent(text[name].lineHeight)})
          </td>
          <td className="px-4 py-3 font-mono text-body-md whitespace-nowrap">
            {toPercent(text[name].letterSpacing)}
          </td>
          <td className="px-4 py-3">
            <p className={textClass[name]}>{sample}</p>
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function TextStylesPage() {
  return (
    <TokensLayout
      title="Text styles"
      description="Cada estilo combina tamanho, peso, altura de linha e espaçamento entre letras. Use a classe inteira, como text-body-lg."
    >
      {() => (
        <>
          {textGroups.map(([group, title, description]) => (
            <Section key={group} title={title} description={description}>
              <TextStyleTable
                names={textStylesBySize.filter((name) => name.split("-")[0] === group)}
              />
            </Section>
          ))}
        </>
      )}
    </TokensLayout>
  );
}

export function FontFamiliesPage() {
  return (
    <TokensLayout
      title="Font families"
      description="DM Sans para todo o texto; uma fonte monoespaçada para código, valores e nomes técnicos."
    >
      {() => (
        <Section
          title="Famílias"
          description="A DM Sans é a fonte padrão: não precisa de classe. Só a mono se aplica com font-mono."
        >
          <Table columns={["Token", "Como usar", "Família", "Exemplo"]}>
            {(Object.keys(font) as (keyof typeof font)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label-md whitespace-nowrap">{name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {name === "mono" ? (
                    <Code>font-mono</Code>
                  ) : (
                    <span className="text-body-md text-muted-foreground">Padrão, sem classe</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Code>{font[name]}</Code>
                </td>
                <td className="px-4 py-3">
                  <p className={name === "mono" ? "font-mono text-body-lg" : "text-body-lg"}>
                    {sample}
                  </p>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}

export function FontWeightsPage() {
  return (
    <TokensLayout title="Font weights" description="Pesos de fonte por intenção.">
      {() => (
        <Section title="Pesos" description="Pesos de fonte por intenção.">
          <Table columns={["Token", "Peso", "Exemplo"]}>
            {(Object.keys(fontWeight) as (keyof typeof fontWeight)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label-md whitespace-nowrap">font-{name}</td>
                <td className="px-4 py-3 font-mono text-body-md">{fontWeight[name]}</td>
                <td className="px-4 py-3">
                  <p className={`text-body-lg ${weightClass[name]}`}>{sample}</p>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
