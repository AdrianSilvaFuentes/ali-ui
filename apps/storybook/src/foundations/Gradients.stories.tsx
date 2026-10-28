import type { Meta, StoryObj } from "@storybook/react-vite";
import { GradientTokensPage } from "./GradientTokensPage";

const meta = {
  title: "Foundations/Gradients",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Overview: StoryObj<typeof meta> = { render: () => <GradientTokensPage /> };
