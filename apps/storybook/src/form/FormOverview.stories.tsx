import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormOverviewPage } from "./FormOverviewPage";

const meta = {
  title: "Components/Form/Visão geral",
  // Endereço sem acento: ?path=/story/components-form-visao-geral--visao-geral
  id: "components-form-visao-geral",
  component: FormOverviewPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FormOverviewPage>;

export default meta;

export const VisaoGeral: StoryObj<typeof meta> = { name: "Visão geral" };
