import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch.tsx";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Liga e desliga algo que vale na hora, como Notificações ativas. Para uma escolha que só vale ao enviar um formulário, como Aceito os termos, use o Checkbox. Clicar no label também liga e desliga. Pelo teclado, o Tab chega no switch e o Espaço ou o Enter trocam o estado.\n\nO trilho tem 28×16px, a mesma altura do Checkbox, e a mesma borda, foco, camada verde e hover. Desligado, o trilho é afundado: fundo neutral-pressed, sem sombra por fora e com inset-shadow-sunken por dentro. A bolinha é branca e elevada, com sombra e contorno border-subtle. Ligado, o verde cobre o trilho. Ao trocar, a bolinha desliza 12px em 200ms (duration-base), desacelerando no fim. Pressionada, estica 2px para o lado em que vai, como se fizesse força. Quem pede menos movimento vê a troca direta.\n\nLabel, ajuda, erro e labelInfo funcionam como no Checkbox. Com erro, a mensagem substitui a ajuda: escreva o erro dizendo o que falta. Como no Input e no Checkbox, exceção consciente: em repouso a borda do trilho é subtle, abaixo dos 3:1 da WCAG. O estado aparece também pela posição da bolinha e pela cor do trilho, nunca só pela cor.",
      },
    },
  },
  args: {
    label: "Notificações por email",
    labelInfo: "Avisos de segurança chegam sempre, mesmo desligado.",
    description: "Novidades e lembretes da sua conta.",
    disabled: false,
  },
  argTypes: {
    label: { control: "text", description: "Texto ao lado do switch. Clicar nele também liga." },
    labelInfo: {
      control: "text",
      description: "Ajuda extra num ícone de info no fim do label, que abre um Toggletip.",
    },
    description: { control: "text", description: "Texto de ajuda abaixo do label." },
    error: {
      control: "text",
      description: "Mensagem de erro. Substitui a ajuda e aparece com ícone.",
    },
    disabled: {
      control: "boolean",
      description: "Desabilita o switch.",
      table: { defaultValue: { summary: "false" } },
    },
    defaultChecked: { control: "boolean", description: "Começa ligado (sem controlar o estado)." },
    className: { control: false, description: "Classes do bloco inteiro." },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  name: "Ligado",
  args: { defaultChecked: true },
};

export const WithError: Story = {
  name: "Com erro",
  args: {
    label: "Backup automático",
    labelInfo: undefined,
    error: "Conecte uma conta de armazenamento antes de ligar.",
  },
};

export const Disabled: Story = {
  name: "Desabilitado",
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Switch
        {...args}
        disabled
        label="Desabilitado"
        labelInfo={undefined}
        description={undefined}
      />
      <Switch
        {...args}
        disabled
        defaultChecked
        label="Desabilitado e ligado"
        labelInfo={undefined}
        description={undefined}
      />
    </div>
  ),
};

export const Settings: Story = {
  name: "Lista de configurações",
  parameters: {
    docs: {
      description: {
        story: "O uso mais comum: uma lista de preferências que valem assim que mudam.",
      },
    },
  },
  render: () => (
    <div className="flex w-xs flex-col gap-4">
      <Switch label="Notificações por email" description="Novidades e lembretes." defaultChecked />
      <Switch label="Notificações no app" description="Avisos enquanto você usa." />
      <Switch
        label="Resumo semanal"
        description="Um email na segunda de manhã."
        labelInfo="Só chega se houve atividade na semana."
        defaultChecked
      />
    </div>
  ),
};
