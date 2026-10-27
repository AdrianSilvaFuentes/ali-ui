import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlaceholderPage } from "./TokensLayout";

const meta = {
  title: "Foundations/Gradients",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => <PlaceholderPage title="Gradients" description="Degradês da identidade." />,
};
