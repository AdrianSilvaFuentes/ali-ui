import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input/Input.tsx";
import { Textarea } from "./Textarea.tsx";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Campo de texto longo, para mensagens, comentários e descrições. Segue as mesmas regras do Input: o label nomeia o campo, a ajuda e o erro são lidos junto pelo leitor de tela, e o erro aparece com ícone e texto, nunca só com a cor vermelha. Sem label visível, passe um aria-label.\n\nBorda, sombra, raio, foco e estados são os mesmos do Input, para os dois conviverem no mesmo formulário. Começa com 3 linhas (rows) e pode ser esticado só na vertical, para não quebrar o layout. Desabilitado perde a alça de redimensionar. No mouse, a caixa toda mostra o cursor de texto, e um clique no respiro também foca o campo.\n\nQuando o texto passa da altura, aparece uma barra de rolagem fina, na cor border-default e sem trilho. O formato dela e quando ela aparece dependem do navegador e do sistema: no Mac, por padrão, ela só surge enquanto se rola.\n\nComo no Input, o placeholder fica abaixo do contraste de 4.5:1 no tema claro: use-o só para exemplos e coloque instruções na ajuda (description).",
      },
    },
  },
  args: {
    className: "w-sm",
    label: "Mensagem",
    labelInfo: "Lemos todas as mensagens. As mais urgentes são respondidas primeiro.",
    placeholder: "Conte o que você precisa",
    size: "md",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Nome do campo." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    className: { control: false, description: "Classes do bloco inteiro, por exemplo a largura." },
    description: { control: "text", description: "Texto de ajuda abaixo do campo." },
    error: {
      control: "text",
      description: "Mensagem de erro. Marca o campo como inválido e aparece com ícone.",
    },
    placeholder: { control: "text", description: "Exemplo do que digitar. Não substitui o label." },
    rows: {
      control: { type: "number", min: 1, max: 12 },
      description: "Altura inicial, em linhas.",
      table: { defaultValue: { summary: "3" } },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Espaço interno e raio, os mesmos do Input: sm e md (padrão).",
      table: { defaultValue: { summary: "md" } },
    },
    readOnly: {
      control: "boolean",
      description: "Somente leitura: mostra o texto, que pode ser copiado, mas não editado.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o campo.",
      table: { defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { description: "Respondemos em até dois dias úteis." },
};

export const WithLabelInfo: Story = {
  name: "Com info no label",
  parameters: {
    docs: {
      description: {
        story:
          "Com labelInfo, um ícone de info no fim do label abre um Toggletip com ajuda extra, como no Input. O necessário para preencher continua na ajuda (description), sempre visível.",
      },
    },
  },
  args: { description: "Respondemos em até dois dias úteis." },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    defaultValue: "Oi",
    description: "Respondemos em até dois dias úteis.",
    error: "Escreva pelo menos 20 letras.",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  args: { disabled: true, defaultValue: "O suporte está fechado no fim de semana." },
};

export const ReadOnly: Story = {
  name: "Somente leitura",
  parameters: {
    docs: {
      description: {
        story:
          "O texto pode ser selecionado e copiado, mas não editado. Fundo bg-readonly e borda que não escurece, como no Input; o texto mantém o contraste pleno e o campo recebe foco. No mouse, o cursor é a seta normal: nem o de digitar, nem o de proibido do desabilitado.",
      },
    },
  },
  args: {
    readOnly: true,
    label: "Observações do pedido",
    labelInfo: "Escritas por quem fez o pedido, na hora da compra.",
    defaultValue: "Entregar na portaria. Ligar antes de subir.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Textarea {...args} size="sm" label="Pequeno (sm)" labelInfo="Respiro e raio menores." />
      <Textarea {...args} size="md" label="Médio (md)" labelInfo="O tamanho padrão." />
    </div>
  ),
};

export const WithoutLabel: Story = {
  name: "Sem label",
  parameters: {
    docs: {
      description: {
        story:
          "Quando o contexto já nomeia o campo, como uma caixa de resposta logo abaixo de um comentário, o label pode sair. O aria-label continua dando o nome para o leitor de tela.",
      },
    },
  },
  args: { label: undefined, "aria-label": "Responder", placeholder: "Escreva uma resposta" },
};

export const WithInput: Story = {
  name: "Com Input",
  parameters: {
    docs: {
      description: {
        story: "No mesmo formulário, Input e Textarea dividem borda, raio, foco e espaçamento.",
      },
    },
  },
  render: (args) => (
    <div className="flex w-sm flex-col gap-4">
      <Input label="Assunto" size={args.size ?? "md"} placeholder="Sobre o que é?" />
      <Textarea {...args} className={undefined} />
    </div>
  ),
};
