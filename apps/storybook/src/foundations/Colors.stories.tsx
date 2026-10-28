import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorGroupPage } from "./ColorTokensPage";
import { ElevationDemo } from "./ElevationDemo";
import { PrimitiveTokensPage } from "./PrimitiveTokensPage";
import { PlaceholderPage } from "./TokensLayout";

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
      description="Cores de texto: padrão, sutil, desabilitado e link. Classes text-default, text-subtle, text-disabled e text-link."
    />
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
    <ColorGroupPage
      group="semantic"
      title="Semantic"
      description="Cores de status: erro, sucesso, aviso e informação. Por enquanto só o erro está definido."
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
