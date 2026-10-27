import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaddingTokensPage } from "./PaddingTokensPage";
import { RadiusTokensPage } from "./RadiusTokensPage";
import { ShadowTokensPage } from "./ShadowTokensPage";
import { SpacingTokensPage } from "./SpacingTokensPage";

const meta = {
  title: "Foundations/Spacing & Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Spacing: Story = { render: () => <SpacingTokensPage /> };
export const Padding: Story = { render: () => <PaddingTokensPage /> };
export const Radius: Story = { render: () => <RadiusTokensPage /> };
export const Shadow: Story = { render: () => <ShadowTokensPage /> };
