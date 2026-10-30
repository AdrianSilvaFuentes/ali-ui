import { Tag } from "@ali/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorGroupPage, ColorTable } from "./ColorTokensPage";
import { ElevationDemo } from "./ElevationDemo";
import { PrimitiveTokensPage } from "./PrimitiveTokensPage";
import { PlaceholderPage, Section, TokensLayout } from "./TokensLayout";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primitive: Story = { render: () => <PrimitiveTokensPage /> };

export const Surface: Story = {
  render: () => (
    <ColorGroupPage
      group="surface"
      title="Surface"
      description="Fundos por altura: rebaixado (sunken), a página, cartões (raised) e menus e diálogos (overlay)."
    >
      <ElevationDemo />
    </ColorGroupPage>
  ),
};

export const Background: Story = {
  render: () => (
    <ColorGroupPage
      group="background"
      title="Background"
      description="Fundos de controles, que vão sobre as superfícies. O neutro do botão secundário, com os estados de cursor em cima e pressionado, o fundo de item escolhido, o fundo de campos somente leitura e o fundo de controles desabilitados. Depois, os fundos suaves de status. A cor da marca do botão primário é um degradê (veja Gradients). A classe é bg-*, sem o prefixo background-."
    >
      <Section
        title="Status"
        description="Fundos suaves neutro, na cor da marca e de cada status: info, success, caution, warning e danger, para o futuro Badge de status, onde a cor tem significado. Cada um leva o texto e o ícone do mesmo tom. Para categorias, como na Tag, veja Infographics. O danger tem ainda os estados de hover e pressionado do botão destrutivo com contorno. Nunca use só a cor para passar a mensagem: acompanhe com palavra ou ícone."
      >
        <ColorTable group="background-status" />
      </Section>
    </ColorGroupPage>
  ),
};

export const Text: Story = {
  render: () => (
    <ColorGroupPage
      group="text"
      title="Text"
      description="Cores de texto: padrão, sutil, desabilitado e link. Depois, os textos de status e os cenários especiais."
    >
      <Section
        title="Status"
        description="Texto na cor de cada status: success, caution, warning, danger e info. Nunca use só a cor para passar a mensagem: acompanhe com palavra ou ícone."
      >
        <ColorTable group="text-status" />
      </Section>
      <Section
        title="Cenários especiais"
        description="Inverse muda com o tema e vai sobre fundos invertidos, como tooltips e toasts. Static fica igual nos dois temas, para fotos, vídeos e fundos fixos; sobre imagens, use uma camada por baixo para garantir a leitura."
      >
        <ColorTable group="text-special" />
      </Section>
    </ColorGroupPage>
  ),
};

export const Border: Story = {
  render: () => (
    <ColorGroupPage
      group="border"
      title="Border"
      description="Contornos: padrão (campos e controles), sutil (divisórias), desabilitado e foco do teclado. Valem para border-*, outline-* e ring-*."
    >
      <Section
        title="Status"
        description="Bordas na cor de cada status, com contraste mínimo de 3:1, como num campo com erro. Acompanhe sempre com texto ou ícone, nunca só a cor."
      >
        <ColorTable group="border-status" />
      </Section>
    </ColorGroupPage>
  ),
};

export const Icon: Story = {
  render: () => (
    <ColorGroupPage
      group="icon"
      title="Icon"
      description="Cores de ícones. Eles herdam a cor do texto (currentColor), por isso a classe é text-icon-*, e ficam um degrau mais suaves que o texto ao lado."
    >
      <Section
        title="Status"
        description="Ícones na cor de cada status, com contraste mínimo de 3:1 e os mesmos passos das bordas de status. Combine com texto: o ícone reforça, não substitui."
      >
        <ColorTable group="icon-status" />
      </Section>
      <Section
        title="Cenários especiais"
        description="Inverse muda com o tema e vai sobre fundos invertidos, como tooltips e toasts. Static fica igual nos dois temas, para fotos, vídeos e fundos fixos; sobre imagens, use uma camada por baixo para garantir a leitura."
      >
        <ColorTable group="icon-special" />
      </Section>
    </ColorGroupPage>
  ),
};

export const Semantic: Story = {
  render: () => (
    <PlaceholderPage
      title="Semantic"
      description="Em breve: a visão por status (success, caution, warning, danger e info), com fundo, texto, borda e ícone de cada um. Os textos de status já estão em Text."
    />
  ),
};

const categoryColors = ["gray", "teal", "blue", "green", "yellow", "orange", "red"] as const;

export const Infographics: Story = {
  render: () => (
    <TokensLayout
      title="Infographics"
      description="Cores de categoria: dizem o tipo de um conteúdo, não um status. Uma tag red marca uma categoria, não um erro. Para cores com significado (erro, sucesso, aviso), use as de status, em Background, Text e Icon. Sete cores, nos mesmos passos dos fundos suaves de status. Mais tarde, as mesmas cores ganham preenchimentos fortes para gráficos."
    >
      {() => (
        <>
          <Section
            title="Na Tag"
            description="Cada cor da Tag usa o fundo, o texto e o ícone da mesma categoria: color='blue' usa background-category-blue, text-category-blue e icon-category-blue."
          >
            <div className="flex flex-wrap gap-2">
              {categoryColors.map((name) => (
                <Tag key={name} color={name}>
                  {name}
                </Tag>
              ))}
            </div>
          </Section>
          <Section
            title="Fundos"
            description="Fundos suaves de cada categoria. A classe é bg-category-*."
          >
            <ColorTable group="category-background" />
          </Section>
          <Section
            title="Textos"
            description="Texto de cada categoria sobre o próprio fundo, com contraste de 4.5:1 ou mais. A classe é text-category-*."
          >
            <ColorTable group="category-text" />
          </Section>
          <Section
            title="Ícones"
            description="Ícone de cada categoria sobre o próprio fundo, com contraste de 3:1 ou mais. A classe é text-icon-category-*."
          >
            <ColorTable group="category-icon" />
          </Section>
        </>
      )}
    </TokensLayout>
  ),
};
