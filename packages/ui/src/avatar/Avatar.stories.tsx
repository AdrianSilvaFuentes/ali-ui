import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar.tsx";

const sizes = ["xl", "lg", "md", "sm", "xs"] as const;

const meta = {
  title: "Components/Data display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Foto ou iniciais de uma pessoa, num círculo (padrão) ou num quadrado (shape square). Com foto (src), mostra a imagem; enquanto ela carrega, ou se falhar, aparecem as iniciais. Sem foto, as iniciais do nome: a primeira letra do primeiro e do último nome (Lia Martins → LM), e uma letra só no xs, onde duas não cabem. Sem nome, um ícone de pessoa.\n\nCinco tamanhos: xl 48px, lg 40px, md 32px (padrão), sm 24px e xs 20px. As iniciais ficam perto de 40% do avatar, e o ícone de pessoa perto de 65% (xl 32px, lg 24px, md 20px, sm 16px, xs 14px). No quadrado, o canto diminui com o tamanho: 8px no xl, lg e md; 6px no sm; 4px no xs. O fundo é background-readonly, um passo abaixo do neutral, com contorno subtle e a sombra mínima (shadow-xs) dos controles, para o círculo aparecer em qualquer superfície.\n\nPara o leitor de tela, o avatar é uma imagem com o nome da pessoa (Lia Martins), nunca as iniciais soltas (LM). Sem nome, é decorativo e fica escondido: use assim só quando o nome já aparece ao lado.",
      },
    },
  },
  args: { name: "Lia Martins", size: "md" },
  argTypes: {
    name: {
      control: "text",
      description: "Nome da pessoa: vira as iniciais e o que o leitor de tela anuncia.",
    },
    src: { control: "text", description: "Endereço da foto." },
    shape: {
      control: "inline-radio",
      options: ["circle", "square"],
      description: "Círculo (padrão) ou quadrado, com o canto proporcional ao tamanho.",
      table: { defaultValue: { summary: "circle" } },
    },
    size: {
      control: "inline-radio",
      options: sizes,
      description: "xl 48px, lg 40px, md 32px (padrão), sm 24px e xs 20px.",
      table: { defaultValue: { summary: "md" } },
    },
    className: { control: false },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: "Tamanhos",
  parameters: {
    docs: {
      description: {
        story: "Do xl ao xs. No xs, as iniciais têm uma letra só.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  name: "Com foto",
  parameters: {
    docs: {
      description: {
        story:
          "Com src, a foto ocupa o círculo inteiro. Enquanto carrega, ou se o endereço falhar, aparecem as iniciais.",
      },
    },
  },
  args: { src: "./avatar-sample.svg" },
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithoutName: Story = {
  name: "Sem nome",
  parameters: {
    docs: {
      description: {
        story:
          "Sem nome, um ícone de pessoa. O avatar fica escondido do leitor de tela: use assim só quando o nome já aparece ao lado.",
      },
    },
  },
  args: { name: undefined },
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const BrokenImage: Story = {
  name: "Foto que falhou",
  parameters: {
    docs: {
      description: {
        story: "Com um endereço que não carrega, o avatar mostra as iniciais, sem imagem quebrada.",
      },
    },
  },
  args: { src: "./nao-existe.png", size: "lg" },
};

export const Square: Story = {
  name: "Quadrado",
  parameters: {
    docs: {
      description: {
        story: 'Com shape="square". O canto é 8px no xl, lg e md; 6px no sm; 4px no xs.',
      },
    },
  },
  args: { shape: "square" },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {sizes.map((size) => (
          <Avatar key={size} {...args} size={size} />
        ))}
      </div>
      <div className="flex items-center gap-4">
        {sizes.map((size) => (
          <Avatar key={size} {...args} size={size} name={undefined} />
        ))}
      </div>
    </div>
  ),
};
