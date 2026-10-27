import type { Meta, StoryObj } from "@storybook/react-vite";
import { DurationTokensPage } from "./DurationTokensPage";

const meta = {
  title: "Foundations/Motion",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const Durations: StoryObj<typeof meta> = { render: () => <DurationTokensPage /> };
