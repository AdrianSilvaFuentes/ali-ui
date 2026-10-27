import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadiusTokensPage } from "./RadiusTokensPage";
import { SpacingTokensPage } from "./SpacingTokensPage";

const meta = {
  title: "Foundations/Spacing & Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Spacing: Story = { render: () => <SpacingTokensPage /> };
export const Radius: Story = { render: () => <RadiusTokensPage /> };
