import { Avatar, Input, MultiSelect, type MultiSelectOption, Select, SelectItem } from "@ali/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBrush,
  IconBuildingArch,
  IconCamera,
  IconDeviceGamepad2,
  IconMail,
  IconMovie,
  IconMusic,
  IconPlane,
  IconToolsKitchen2,
  IconTypography,
} from "@tabler/icons-react";
import { ShowcasePanel } from "./ShowcasePanel";

const interests: MultiSelectOption[] = [
  { value: "tipografia", color: "blue", icon: <IconTypography />, label: "Tipografia" },
  { value: "fotografia", color: "orange", icon: <IconCamera />, label: "Fotografia" },
  { value: "cinema", color: "yellow", icon: <IconMovie />, label: "Cinema" },
  { value: "ilustracao", color: "red", icon: <IconBrush />, label: "Ilustração" },
  { value: "arquitetura", color: "gray", icon: <IconBuildingArch />, label: "Arquitetura" },
  { value: "musica", color: "teal", icon: <IconMusic />, label: "Música" },
  { value: "viagem", color: "green", icon: <IconPlane />, label: "Viagem" },
  { value: "culinaria", color: "orange", icon: <IconToolsKitchen2 />, label: "Culinária" },
  { value: "games", color: "gray", icon: <IconDeviceGamepad2 />, label: "Games" },
];

const meta = {
  title: "Showcase/Form",
  component: ShowcasePanel,
  parameters: { layout: "centered" },
  args: { category: "Form", title: "Inputs and selects" },
} satisfies Meta<typeof ShowcasePanel>;

export default meta;

export const InputsAndSelects: StoryObj<typeof meta> = {
  name: "Inputs and selects",
  render: (args) => (
    <ShowcasePanel {...args}>
      <div className="flex justify-center gap-4 pt-12">
        <MultiSelect
          className="w-sm"
          size="sm"
          label="Interesses"
          labelInfo="Usados para sugerir conteúdos para você."
          placeholder="Escolha seus interesses"
          options={interests}
          defaultValue={["tipografia", "fotografia", "cinema", "ilustracao", "musica"]}
          onOptionsReorder={() => {}}
        />
        <div className="flex w-2xs flex-col gap-8 pt-9">
          <Select label="Responsável" placeholder="Selecione" size="sm">
            <SelectItem
              value="lia"
              leading={<Avatar name="Lia Martins" size="xs" />}
              description="lia@exemplo.com"
            >
              Lia Martins
            </SelectItem>
            <SelectItem
              value="caio"
              leading={<Avatar name="Caio Ribeiro" size="xs" />}
              description="caio@exemplo.com"
            >
              Caio Ribeiro
            </SelectItem>
            <SelectItem
              value="nara"
              leading={<Avatar name="Nara Torres" size="xs" />}
              description="nara@exemplo.com"
              disabled
            >
              Nara Torres
            </SelectItem>
          </Select>
          <Input
            size="sm"
            type="email"
            label="E-mail"
            labelInfo="Seu e-mail não aparece para outras pessoas."
            placeholder="Insira seu e-mail"
            description="Usamos só para avisos da conta."
            iconLeft={<IconMail />}
          />
        </div>
      </div>
    </ShowcasePanel>
  ),
};
