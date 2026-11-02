import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCopy, IconPencil, IconTrash } from "@tabler/icons-react";
import { Button } from "../button/Button.tsx";
import { Tooltip } from "./Tooltip.tsx";

const meta = {
  title: "Components/Overlay/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Rótulo curto que aparece ao passar o mouse (depois de 500ms) ou na hora, ao focar com o teclado. Fecha ao tirar o mouse, ao sair do foco ou com Esc. Serve para nomear botões só de ícone e mostrar textos cortados.\n\nO fundo é surface-inverse: escuro no tema claro e claro no escuro, com texto em text-inverse. Assim ele sempre se destaca da página. Tem a mesma elevação do Toggletip (shadow-md), mais leve que a de menus e diálogos. O texto é body-md (14px), com 6px em cima e embaixo e 12px nas laterais, e os cantos são lg (8px), discretos para um rótulo de uma linha. Um tail de 8×4px aponta para o elemento. Entra e sai com o mesmo movimento do Toggletip; quem pede menos movimento vê só o fade.\n\nPara o leitor de tela, o tooltip é ligado ao elemento com aria-describedby e lido como descrição. Ele não substitui o nome: um botão só de ícone continua precisando de aria-label.\n\nNão abre no toque. Por isso, nunca coloque nele algo que a pessoa precisa saber: para ajuda que deve funcionar no celular, use o Toggletip.",
      },
    },
  },
  args: {
    content: "Copiar link",
    side: "top",
    align: "center",
    delay: 500,
    children: <Button variant="secondary" aria-label="Copiar link" iconLeft={<IconCopy />} />,
  },
  argTypes: {
    content: { control: "text", description: "Rótulo do tooltip. Curto, sem links." },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
      description: "Lado em que o tooltip abre. Se não couber, vai para o lado oposto.",
      table: { defaultValue: { summary: "top" } },
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Alinhamento em relação ao elemento.",
      table: { defaultValue: { summary: "center" } },
    },
    delay: {
      control: { type: "number", min: 0, step: 100 },
      description: "Espera, em ms, entre o mouse chegar e o tooltip abrir.",
      table: { defaultValue: { summary: "500" } },
    },
    children: { control: false, description: "Elemento que abre o tooltip. Precisa aceitar foco." },
    className: { control: false, description: "Classes do balão." },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IconButtons: Story = {
  name: "Botões só de ícone",
  parameters: {
    docs: {
      description: {
        story:
          "O uso principal: dar nome visível a ações que só mostram o ícone. O aria-label continua no botão.",
      },
    },
  },
  render: (args) => (
    <div className="flex gap-2">
      {[
        { label: "Editar", icon: <IconPencil /> },
        { label: "Copiar link", icon: <IconCopy /> },
        { label: "Excluir", icon: <IconTrash /> },
      ].map(({ label, icon }) => (
        <Tooltip key={label} {...args} content={label}>
          <Button variant="secondary" size="sm" aria-label={label} iconLeft={icon} />
        </Tooltip>
      ))}
    </div>
  ),
};

export const Sides: Story = {
  name: "Lados",
  render: (args) => (
    <div className="grid grid-cols-2 gap-x-24 gap-y-16 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`Abre em ${side}`}>
          <Button variant="secondary" size="sm">
            {side}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};
