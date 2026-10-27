import { font, fontWeight, text } from "@ali/tokens";
import { Code, Section, Table, TokensLayout, toPx } from "./TokensLayout";

// O Tailwind só gera classes escritas por extenso no código, por isso as listas explícitas.
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

const fontClass: Record<keyof typeof font, string> = {
  body: "font-body",
  heading: "font-heading",
  mono: "font-mono",
};

const weightClass: Record<keyof typeof fontWeight, string> = {
  regular: "font-regular",
  medium: "font-medium",
  strong: "font-strong",
};

// Estilos de texto do maior para o menor.
const textStylesBySize = (Object.keys(text) as (keyof typeof text)[]).sort(
  (a, b) => Number.parseFloat(text[b].fontSize) - Number.parseFloat(text[a].fontSize),
);

const sample = "Um sistema enxuto, com poucos componentes e muita personalidade.";

export function TextStylesPage() {
  return (
    <TokensLayout
      title="Text styles"
      description="Estilos de texto: tamanho, altura de linha e peso combinados."
    >
      {() => (
        <Section
          title="Estilos de texto"
          description="Cada estilo combina tamanho, altura de linha e peso. Use a classe inteira, como text-body."
        >
          <Table columns={["Token", "Tamanho", "Altura de linha", "Peso", "Exemplo"]}>
            {textStylesBySize.map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label whitespace-nowrap">text-{name}</td>
                <td className="px-4 py-3 font-mono text-body-sm whitespace-nowrap">
                  {text[name].fontSize} · {toPx(text[name].fontSize)}
                </td>
                <td className="px-4 py-3 font-mono text-body-sm">{text[name].lineHeight}</td>
                <td className="px-4 py-3 font-mono text-body-sm">{text[name].fontWeight}</td>
                <td className="px-4 py-3">
                  <p className={textClass[name]}>{sample}</p>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}

export function FontFamiliesPage() {
  return (
    <TokensLayout
      title="Font families"
      description="Famílias de fonte por uso. Ainda são as fontes do sistema."
    >
      {() => (
        <Section title="Famílias" description="Fonte de texto, de títulos e monoespaçada.">
          <Table columns={["Token", "Família", "Exemplo"]}>
            {(Object.keys(font) as (keyof typeof font)[]).map((name) => (
              <tr key={name} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-label whitespace-nowrap">font-{name}</td>
                <td className="px-4 py-3">
                  <Code>{font[name]}</Code>
                </td>
                <td className="px-4 py-3">
                  <p className={`text-body ${fontClass[name]}`}>{sample}</p>
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
                <td className="px-4 py-3 text-label whitespace-nowrap">font-{name}</td>
                <td className="px-4 py-3 font-mono text-body-sm">{fontWeight[name]}</td>
                <td className="px-4 py-3">
                  <p className={`text-body ${weightClass[name]}`}>{sample}</p>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
