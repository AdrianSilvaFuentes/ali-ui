import { type BrandName, brandPalettes, brandTokens } from "@ali/tokens";
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@ali/ui";
import { IconMail, IconWorld } from "@tabler/icons-react";
import { type FormEvent, useState } from "react";

/** Os componentes de Form, com o papel de cada um e o link para a página dele. */
const components = [
  ["Input", "components-form-input--docs", "Texto curto: nome, email, busca."],
  ["Textarea", "components-form-textarea--docs", "Texto longo: descrições e mensagens."],
  ["Select", "components-form-select--docs", "Uma escolha numa lista longa."],
  ["Checkbox", "components-form-checkbox--docs", "Aceitar algo ou marcar várias opções."],
  ["RadioGroup", "components-form-radiogroup--docs", "Uma escolha entre poucas opções."],
  ["Switch", "components-form-switch--docs", "Ligar e desligar algo que vale na hora."],
] as const;

/** Erros do exemplo: só aparecem depois de tentar criar o projeto. */
interface Errors {
  name?: string;
  email?: string;
  terms?: string;
}

/**
 * Página de abertura do grupo Form: um formulário de exemplo com todos os campos juntos, para
 * ver de uma vez como eles combinam em altura, espaço, label, ajuda e erro.
 */
interface FormOverviewPageProps {
  /** A cor de marca escolhida, a mesma do seletor Marca da barra de ferramentas. */
  brand?: BrandName;
  /** Troca a cor de marca (atualiza o seletor da barra também). */
  onBrandChange?: (brand: BrandName) => void;
}

/** Nome de cada paleta no seletor. */
const brandNames: Record<BrandName, string> = {
  teal: "Teal",
  blue: "Blue",
  green: "Green",
  orange: "Orange",
  red: "Red",
  yellow: "Yellow",
};

/** A cor de cada marca na bolinha do seletor: o início do degradê do botão primário. */
function brandSwatch(name: BrandName): string {
  return name === "teal"
    ? brandPalettes.teal[700]
    : (brandTokens(name).gradient.brand?.from ?? brandPalettes[name][700]);
}

export function FormOverviewPage({ brand = "teal", onBrandChange }: FormOverviewPageProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [created, setCreated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const next: Errors = {
      name: data.get("name") ? undefined : "Dê um nome ao projeto.",
      email: email.includes("@") ? undefined : "Falta o @, como em voce@exemplo.com.",
      terms: data.get("terms") ? undefined : "Aceite os termos para criar o projeto.",
    };
    setErrors(next);
    setCreated(!next.name && !next.email && !next.terms);
  }

  return (
    <div className="min-h-screen bg-surface-sunken px-6 py-10 text-default">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-title-lg">Form</h1>
          <p className="text-body-lg text-subtle">
            Todos os campos juntos num formulário de exemplo.
          </p>
        </header>

        {/* A mesma escolha do seletor Marca da barra: troca a paleta do primary na hora. */}
        <RadioGroup
          label="Cor da marca"
          labelInfo="Troca a paleta do primary: botões, links, foco e itens escolhidos. Erro e sucesso não mudam."
          orientation="horizontal"
          value={brand}
          onValueChange={(value) => onBrandChange?.(value as BrandName)}
        >
          {(Object.keys(brandNames) as BrandName[]).map((name) => (
            <RadioGroupItem
              key={name}
              value={name}
              label={
                <span className="inline-flex items-center gap-1.5">
                  {/* A cor vem dos tokens; a bolinha é só decorativa: o nome diz a cor. */}
                  <span
                    aria-hidden="true"
                    className="size-3 rounded-full"
                    style={{ backgroundColor: brandSwatch(name) }}
                  />
                  {brandNames[name]}
                </span>
              }
            />
          ))}
        </RadioGroup>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-xl bg-neutral p-6 shadow-raised"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-title-sm">Novo projeto</h2>
            <p className="text-body-md text-subtle">Leva um minuto. Dá para mudar tudo depois.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              size="sm"
              name="name"
              label="Nome do projeto"
              labelInfo="Aparece no topo do painel e nos emails para a equipe."
              placeholder="Loja de verão"
              description="Curto e fácil de reconhecer."
              error={errors.name}
            />
            <Input
              size="sm"
              name="email"
              type="email"
              label="Email de contato"
              placeholder="voce@exemplo.com"
              iconLeft={<IconMail />}
              description="Para avisos sobre o projeto."
              error={errors.email}
            />
          </div>

          <Select
            size="sm"
            name="region"
            label="Região do servidor"
            labelInfo="Escolha a mais perto de quem vai usar: as páginas abrem mais rápido."
            placeholder="Escolha uma região"
            defaultValue="sa"
          >
            <SelectItem value="sa" leading={<IconWorld />} description="São Paulo">
              América do Sul
            </SelectItem>
            <SelectItem value="us" leading={<IconWorld />} description="Virgínia">
              América do Norte
            </SelectItem>
            <SelectItem value="eu" leading={<IconWorld />} description="Frankfurt">
              Europa
            </SelectItem>
          </Select>

          <Textarea
            size="sm"
            name="description"
            label="Descrição"
            placeholder="Para que serve este projeto?"
            description="Opcional. Ajuda quem chegar depois a entender o projeto."
          />

          <RadioGroup name="plan" label="Plano" defaultValue="pro">
            <RadioGroupItem
              value="free"
              label="Grátis"
              description="Um projeto, sem colaboradores."
            />
            <RadioGroupItem
              value="pro"
              label="Pro"
              description="Projetos ilimitados, até 5 pessoas."
            />
            <RadioGroupItem value="team" label="Time" description="Para empresas, com suporte." />
          </RadioGroup>

          <div className="flex flex-col gap-4 border-t border-subtle pt-5">
            <Switch
              name="notify"
              label="Avisos por email"
              description="Quando alguém comentar ou mudar algo no projeto."
              defaultChecked
            />
            <Checkbox name="terms" label="Li e aceito os termos de uso" error={errors.terms} />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-subtle pt-5">
            {created ? (
              <p role="status" className="mr-auto text-body-md text-success">
                Projeto criado. (É só um exemplo.)
              </p>
            ) : null}
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={() => {
                setErrors({});
                setCreated(false);
              }}
            >
              Cancelar
            </Button>
            <Button size="sm" type="submit">
              Criar projeto
            </Button>
          </div>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-title-sm">Cada componente</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {components.map(([name, id, role]) => (
              <li key={id}>
                <a
                  href={`./?path=/docs/${id}`}
                  target="_top"
                  className="flex h-full flex-col gap-0.5 rounded-lg border border-subtle bg-surface px-4 py-3 hover:border-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="text-label-md text-link">{name}</span>
                  <span className="text-body-sm text-subtle">{role}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
