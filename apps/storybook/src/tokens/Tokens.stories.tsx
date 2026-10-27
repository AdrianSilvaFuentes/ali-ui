import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorTokensPage } from "./ColorTokensPage";
import { DurationTokensPage } from "./DurationTokensPage";
import { PrimitiveTokensPage } from "./PrimitiveTokensPage";
import { RadiusTokensPage } from "./RadiusTokensPage";
import { SpacingTokensPage } from "./SpacingTokensPage";
import { TypographyTokensPage } from "./TypographyTokensPage";

const meta = {
  title: "Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primitivos: Story = { name: "Primitivos", render: () => <PrimitiveTokensPage /> };
export const Cores: Story = { name: "Cores", render: () => <ColorTokensPage /> };
export const Tipografia: Story = { name: "Tipografia", render: () => <TypographyTokensPage /> };
export const Espacamento: Story = { name: "Espaçamento", render: () => <SpacingTokensPage /> };
export const Raios: Story = { name: "Raios", render: () => <RadiusTokensPage /> };
export const Duracoes: Story = { name: "Durações", render: () => <DurationTokensPage /> };
