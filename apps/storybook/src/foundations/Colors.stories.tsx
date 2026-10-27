import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorGroupPage } from "./ColorTokensPage";
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
      description="Fundos: da página, de elementos elevados e de áreas preenchidas com a cor de marca."
    />
  ),
};

export const Text: Story = {
  render: () => (
    <ColorGroupPage
      group="text"
      title="Text"
      description="Cores de texto: principal, secundário, links e texto sobre a cor de marca."
    />
  ),
};

export const Border: Story = {
  render: () => (
    <ColorGroupPage
      group="border"
      title="Border"
      description="Contornos: divisórias, campos e o foco visível do teclado."
    />
  ),
};

export const Icon: Story = {
  render: () => <PlaceholderPage title="Icon" description="Cores de ícones." />,
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
