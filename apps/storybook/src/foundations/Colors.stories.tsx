import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorGroupPage, ColorTable } from "./ColorTokensPage";
import { ElevationDemo } from "./ElevationDemo";
import { PrimitiveTokensPage } from "./PrimitiveTokensPage";
import { PlaceholderPage, Section } from "./TokensLayout";

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
      description="Fundos de controles, que vão sobre as superfícies. O neutro do botão secundário, com os estados de cursor em cima e pressionado, os fundos suaves de risco (hover e pressionado do botão destrutivo com contorno) o fundo de campos somente leitura e o fundo de controles desabilitados. A cor da marca do botão primário é um degradê (veja Gradients). A classe é bg-*, sem o prefixo background-."
    />
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

export const Infographics: Story = {
  render: () => (
    <PlaceholderPage
      title="Infographics"
      description="Cores para gráficos e visualização de dados."
    />
  ),
};
