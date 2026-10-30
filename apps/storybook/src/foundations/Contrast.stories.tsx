import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContrastPage } from "./ContrastPage";

const meta = {
  title: "Foundations/Contrast",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Overview: StoryObj<typeof meta> = { render: () => <ContrastPage /> };
