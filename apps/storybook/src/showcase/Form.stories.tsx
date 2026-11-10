import {
  Avatar,
  Checkbox,
  Combobox,
  Input,
  MultiSelect,
  type MultiSelectOption,
  NumberInput,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  Slider,
  Switch,
  Textarea,
} from "@ali/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBrush,
  IconBuildingArch,
  IconCamera,
  IconDeviceGamepad2,
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

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colômbia" },
  { value: "pt", label: "Portugal" },
];

/**
 * Duas colunas de mesma largura (metade cada, dentro de 768px, w-3xl), como um formulário de
 * verdade: campos à esquerda, controles compactos à direita. Nas duas primeiras linhas, o
 * NumberInput e o SegmentedControl ficam na base da linha (self-end), alinhados com a caixa do
 * campo ao lado, e não com o label dele. Depois, cada coluna segue no próprio ritmo.
 */
export const InputsAndSelects: StoryObj<typeof meta> = {
  name: "Inputs and selects",
  render: (args) => (
    <ShowcasePanel {...args}>
      <div className="mx-auto grid w-3xl grid-cols-2 gap-x-16 gap-y-6 pt-4">
        <Input label="Nome do projeto" placeholder="Ex.: Site institucional" />
        <NumberInput className="self-end" aria-label="Pessoas no time" defaultValue={1} min={1} />
        <Select
          label="Responsável"
          labelInfo="Quem recebe os avisos do projeto."
          placeholder="Selecione"
          defaultValue="lia"
        >
          <SelectItem value="lia" leading={<Avatar name="Lia Martins" size="xs" />}>
            Lia Martins
          </SelectItem>
          <SelectItem value="caio" leading={<Avatar name="Caio Ribeiro" size="xs" />}>
            Caio Ribeiro
          </SelectItem>
        </Select>
        <SegmentedControl className="self-end" aria-label="Visualização" defaultValue="list">
          <SegmentedControlItem value="list">Lista</SegmentedControlItem>
          <SegmentedControlItem value="grid">Grade</SegmentedControlItem>
        </SegmentedControl>
        <div className="flex flex-col gap-6">
          <Textarea rows={2} label="Descrição" placeholder="Para que serve este projeto?" />
          <Combobox
            label="País da sede"
            labelInfo="Usamos para calcular impostos."
            placeholder="Busque um país"
            options={countries}
          />
          <MultiSelect
            label="Interesses"
            placeholder="Escolha seus interesses"
            options={interests}
            defaultValue={["tipografia", "cinema"]}
          />
        </div>
        <div className="flex flex-col items-start gap-8 pt-1">
          <Checkbox label="Lembrar de mim" defaultChecked />
          <RadioGroup aria-label="Plano" defaultValue="pro">
            <RadioGroupItem value="pro" label="Plano Pro" />
          </RadioGroup>
          <Switch label="Avisos por email" />
          <Slider
            className="w-full"
            label="Orçamento por mês"
            defaultValue={[200, 800]}
            max={1000}
            step={50}
            minStepsBetweenThumbs={1}
            formatValue={(v) => `R$ ${v}`}
          />
        </div>
      </div>
    </ShowcasePanel>
  ),
};
