import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./Chip.tsx";

const meta = {
  title: "Components/Data display/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Uma pessoa numa pílula: avatar, nome e, com onRemove, um X para tirar. Use para mostrar pessoas escolhidas, como responsáveis ou participantes; para categorias, use o Tag.\n\nA pílula segue o Figma: fundo neutral, sombra mínima (shadow-xs) e o brilho no topo, como o Tag, com o nome em label-sm (12px). O contorno border-subtle é por dentro, como no Avatar: não ocupa espaço, e os respiros são medidos da borda de fora. O avatar fica a 2px da borda da esquerda; à direita, 6px até o X, ou, sem X, 8px no sm e 10px no md. 4px separam avatar, nome e X. O X é o ícone de 14px em icon-subtle, que escurece no hover. No hover, o chip todo ganha o fundo neutral-hovered. Dois tamanhos: sm tem 24px, com avatar de 20px e canto de 12px; md tem 28px, com avatar de 24px e canto de 16px. Cabem no campo do mesmo tamanho.\n\nSem foto, o avatar mostra as iniciais. O leitor de tela lê só o nome, uma vez: o avatar não é anunciado de novo. Pelo teclado, o X recebe foco, e Enter, Espaço, Delete ou Backspace removem. Depois de remover, leve o foco para outro lugar.",
      },
    },
  },
  args: { name: "Lia Martins", size: "md", src: "Com foto" },
  argTypes: {
    name: { control: "text", description: "O nome da pessoa: o texto e as iniciais do avatar." },
    src: {
      // Escolha rápida no painel, como no Avatar; no código, src é o endereço da foto.
      control: "inline-radio",
      options: ["Sem foto", "Com foto", "Foto quebrada"],
      mapping: {
        "Sem foto": undefined,
        "Com foto": "./avatar-sample.png",
        "Foto quebrada": "./nao-existe.png",
      },
      description: "Endereço da foto. Enquanto carrega, ou se falhar, aparecem as iniciais.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Altura: sm tem 24px, md tem 28px.",
      table: { defaultValue: { summary: "md" } },
    },
    onRemove: { control: false, description: "Mostra um X que chama esta função." },
    removeLabel: { control: "text", description: 'Nome do X. Padrão: "Remover" + o nome.' },
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Removable: Story = {
  name: "Com X",
  args: { onRemove: () => {} },
};

export const Sizes: Story = {
  name: "Tamanhos",
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Chip name="Lia Martins" src="./avatar-sample.png" size="sm" onRemove={() => {}} />
      <Chip name="Lia Martins" src="./avatar-sample.png" onRemove={() => {}} />
    </div>
  ),
};

export const Group: Story = {
  name: "Várias pessoas",
  parameters: {
    docs: {
      description: {
        story:
          "O uso mais comum: as pessoas escolhidas, lado a lado. Quem tem foto aparece com ela; quem não tem, com as iniciais.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-1.5">
      <Chip name="Lia Martins" src="./avatar-sample.png" onRemove={() => {}} />
      <Chip name="Caio Ribeiro" src="./avatar-sample-2.png" onRemove={() => {}} />
      <Chip name="Nara Torres" onRemove={() => {}} />
    </div>
  ),
};

export const WithoutPhoto: Story = {
  name: "Sem foto",
  parameters: {
    docs: {
      description: { story: "Sem src, ou se a foto falhar, o avatar mostra as iniciais do nome." },
    },
  },
  args: { src: "Sem foto", onRemove: () => {} },
};
