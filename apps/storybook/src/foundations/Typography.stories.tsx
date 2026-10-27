import type { Meta, StoryObj } from "@storybook/react-vite";
import { FontFamiliesPage, FontWeightsPage, TextStylesPage } from "./TypographyTokensPage";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextStyles: Story = { name: "Text styles", render: () => <TextStylesPage /> };
export const FontFamilies: Story = { name: "Font families", render: () => <FontFamiliesPage /> };
export const FontWeights: Story = { name: "Font weights", render: () => <FontWeightsPage /> };
