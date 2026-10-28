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

export const Text: Story = {
  render: () => (
    <ColorGroupPage
      group="text"
      title="Text"
      description="Cores de texto: padrão, sutil, desabilitado e link; inverse para fundos que invertem com o tema; static para manter branco ou preto nos dois temas."
    >
      <Section
        title="Status"
        description="Texto na cor de cada status: success, caution, warning, danger e info. Nunca use só a cor para passar a mensagem: acompanhe com palavra ou ícone."
      >
        <ColorTable group="text-status" />
      </Section>
    </ColorGroupPage>
  ),
};

export const Border: Story = {
  render: () => (
    <ColorGroupPage
      group="border"
      title="Border"
      description="Contornos: padrão (divisórias), forte (campos e controles) e foco do teclado. Valem para border-*, outline-* e ring-*."
    />
  ),
};

export const Icon: Story = {
  render: () => (
    <ColorGroupPage
      group="icon"
      title="Icon"
      description="Cores de ícones. Eles herdam a cor do texto (currentColor), por isso a classe é text-icon-*, e ficam um degrau mais suaves que o texto ao lado."
    />
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
