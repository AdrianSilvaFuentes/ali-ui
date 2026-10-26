import type { Meta, StoryObj } from "@storybook/react-vite";
import { TokensPage } from "./TokensPage";

const meta = {
  title: "Tokens",
  component: TokensPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TokensPage>;

export default meta;

export const Tokens: StoryObj<typeof meta> = {};
