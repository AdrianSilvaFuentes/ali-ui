import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitiveTokensPage } from "./PrimitiveTokensPage";
import { SemanticTokensPage } from "./SemanticTokensPage";

const meta = {
  title: "Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Semanticos: Story = {
  name: "Semânticos",
  render: () => <SemanticTokensPage />,
};

export const Primitivos: Story = {
  name: "Primitivos",
  render: () => <PrimitiveTokensPage />,
};
