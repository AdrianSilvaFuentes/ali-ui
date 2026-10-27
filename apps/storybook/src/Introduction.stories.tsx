import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntroductionPage } from "./IntroductionPage";

const meta = {
  title: "Introdução",
  component: IntroductionPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof IntroductionPage>;

export default meta;

export const Introducao: StoryObj<typeof meta> = { name: "Introdução" };
