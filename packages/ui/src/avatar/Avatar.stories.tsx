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
          "Foto ou iniciais de uma pessoa, num círculo. Com foto (src), mostra a imagem; enquanto ela carrega, ou se falhar, aparecem as iniciais. Sem foto, as iniciais do nome: a primeira letra do primeiro e do último nome (Lia Martins → LM), e uma letra só no xs, onde duas não cabem. Sem nome, um ícone de pessoa.\n\nCinco tamanhos: xl 48px, lg 40px, md 32px (padrão), sm 24px e xs 20px. As iniciais e o ícone ficam perto de 40% do círculo. O fundo é background-readonly, um passo abaixo do neutral, com contorno subtle e a sombra mínima (shadow-xs) dos controles, para o círculo aparecer em qualquer superfície.\n\nPara o leitor de tela, o avatar é uma imagem com o nome da pessoa (Lia Martins), nunca as iniciais soltas (LM). Sem nome, é decorativo e fica escondido: use assim só quando o nome já aparece ao lado.",
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
