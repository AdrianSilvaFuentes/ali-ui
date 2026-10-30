import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShowcasePanel } from "./ShowcasePanel";

const meta = {
  title: "Showcase/Form",
  component: ShowcasePanel,
  parameters: { layout: "centered" },
  args: { category: "Form", title: "Inputs and selects" },
} satisfies Meta<typeof ShowcasePanel>;

export default meta;

export const InputsAndSelects: StoryObj<typeof meta> = { name: "Inputs and selects" };
