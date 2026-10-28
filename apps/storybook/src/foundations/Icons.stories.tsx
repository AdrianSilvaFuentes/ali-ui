import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconsPage } from "./IconsPage";

const meta = {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Icons: StoryObj<typeof meta> = { render: () => <IconsPage /> };
