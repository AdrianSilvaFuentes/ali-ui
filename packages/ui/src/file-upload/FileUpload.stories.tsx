import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "./FileUpload.tsx";

/** Arquivos de exemplo, para as histórias mostrarem a lista sem precisar escolher nada. */
function sample(name: string, type: string, size: number) {
  return new File([new Uint8Array(size)], name, { type });
}

const meta = {
  title: "Components/Form/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Área para arrastar arquivos, ou clicar e escolher. Os escolhidos aparecem numa lista abaixo, com o tamanho e um X para remover. Com um arquivo só (o padrão), um novo troca o anterior; com multiple, eles se somam.\n\nCom accept e maxSize, arquivos de tipo errado ou grandes demais ficam de fora, e um aviso diz qual e por quê: planilha.xlsx não é de um tipo aceito. Escreva o que a área aceita em hint, numa linha dentro dela, para a pessoa saber antes de tentar.\n\nA área tem borda tracejada border-default, fundo neutral-subtle e canto de 12px, como o Input md. No hover, o fundo escurece um tom. Com um arquivo por cima, borda e fundo vão para a cor da marca, e o ícone também: pode soltar. Cada arquivo da lista é uma linha de 40px com borda border-subtle, e o X é um Button ghost sm.\n\nPelo teclado, a área é um botão: Enter ou Espaço abrem a escolha de arquivos. O leitor de tela ouve o label, a ação e a dica, e é avisado quando um arquivo entra ou sai. Depois de remover, o foco vai para o X do próximo arquivo, ou volta para a área. Com name, os arquivos vão junto ao enviar o formulário.",
      },
    },
  },
  args: {
    label: "Anexos",
    labelInfo: "Os arquivos ficam visíveis para todo o time.",
    hint: "PDF ou PNG, até 5 MB",
    description: "Opcional. Ajuda quem vai revisar o pedido.",
    accept: ".pdf,image/png",
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: false,
    className: "w-sm",
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo, acima da área." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    hint: { control: "text", description: "O que a área aceita, numa linha dentro dela." },
    description: { control: "text", description: "Texto de ajuda abaixo da área." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    accept: { control: "text", description: 'Tipos aceitos: ".pdf,image/png" ou "image/*".' },
    maxSize: { control: "number", description: "Tamanho máximo de cada arquivo, em bytes." },
    multiple: {
      control: "boolean",
      description: "Aceita vários arquivos. Sem ele, um novo troca o anterior.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita a área e os X.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultValue: { control: false, description: "Os arquivos ao abrir, sem controlar o estado." },
    value: { control: false, description: "Os arquivos, controlados por fora." },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  name: "Vários arquivos",
  args: { multiple: true, labelInfo: undefined, description: undefined },
};

export const WithFiles: Story = {
  name: "Com arquivos",
  args: {
    multiple: true,
    labelInfo: undefined,
    description: undefined,
    defaultValue: [
      sample("contrato-assinado.pdf", "application/pdf", 1258291),
      sample("logo.png", "image/png", 83968),
    ],
  },
};

export const WithError: Story = {
  name: "Com erro",
  args: { labelInfo: undefined, description: undefined, error: "Envie o contrato assinado." },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: {
    disabled: true,
    labelInfo: undefined,
    description: undefined,
    defaultValue: [sample("contrato-assinado.pdf", "application/pdf", 1258291)],
  },
};
