import type { BrandName } from "@ali/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useGlobals } from "storybook/preview-api";
import { FormOverviewPage } from "./FormOverviewPage";

const meta = {
  title: "Components/Form/Visão geral",
  // Endereço sem acento: ?path=/story/components-form-visao-geral--visao-geral
  id: "components-form-visao-geral",
  component: FormOverviewPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FormOverviewPage>;

export default meta;

export const VisaoGeral: StoryObj<typeof meta> = {
  name: "Visão geral",
  // O seletor de marca da página e o da barra de ferramentas são a mesma escolha.
  render: () => {
    const [globals, updateGlobals] = useGlobals();
    return (
      <FormOverviewPage
        brand={(globals.brand as BrandName | undefined) ?? "teal"}
        onBrandChange={(brand) => updateGlobals({ brand })}
      />
    );
  },
};
