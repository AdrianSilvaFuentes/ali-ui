import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import { IconUser } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn.ts";

/**
 * O círculo do avatar. Sem foto, fundo readonly (um passo abaixo do neutral) com contorno
 * suave, para o círculo aparecer em qualquer superfície, inclusive na opção em destaque de
 * uma lista. Sombra mínima (xs), a mesma dos controles.
 */
export const avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "bg-readonly text-subtle shadow-xs ring-1 ring-subtle select-none",
  ],
  {
    variants: {
      // Iniciais perto de 40% do avatar; o ícone de pessoa, perto de 65%.
      size: {
        xs: "size-5 text-label-xs [&_svg]:size-3.5",
        sm: "size-6 text-label-sm [&_svg]:size-4",
        md: "size-8 text-label-md [&_svg]:size-5",
        lg: "size-10 text-label-lg [&_svg]:size-6",
        xl: "size-12 text-title-sm [&_svg]:size-8",
      },
      // Círculo (padrão) ou quadrado; o canto do quadrado diminui com o tamanho (abaixo).
      shape: {
        circle: "rounded-full",
        square: "",
      },
    },
    compoundVariants: [
      { shape: "square", size: ["md", "lg", "xl"], class: "rounded-lg" },
      { shape: "square", size: "sm", class: "rounded-md" },
      { shape: "square", size: "xs", class: "rounded-sm" },
    ],
    defaultVariants: { size: "md", shape: "circle" },
  },
);

/**
 * Iniciais de um nome: a primeira letra do primeiro e do último nome ("Lia Martins" → "LM").
 * Com `max` 1, só a primeira ("L"). Sem letras, vazio.
 */
export function initials(name: string | undefined, max: 1 | 2 = 2): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return (max === 1 ? first : first + last).toUpperCase();
}

export interface AvatarProps
  extends Omit<ComponentProps<typeof Root>, "asChild" | "children">,
    VariantProps<typeof avatarVariants> {
  /** O nome da pessoa: vira as iniciais e o que o leitor de tela anuncia. */
  name?: string;
  /** Endereço da foto. Enquanto carrega, ou se falhar, aparecem as iniciais. */
  src?: string;
}

/**
 * Foto ou iniciais de uma pessoa, num círculo ou num quadrado (`shape`). Sem foto, mostra as iniciais do nome (uma letra
 * só no xs); sem nome, um ícone de pessoa. Para o leitor de tela, o avatar é uma imagem com o
 * nome da pessoa, nunca as iniciais soltas. Sem nome, é decorativo.
 */
export function Avatar({ className, size, shape, name, src, ...props }: AvatarProps) {
  const letters = initials(name, size === "xs" ? 1 : 2);
  const label = name?.trim() || undefined;

  return (
    <Root
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {/*
       * O círculo é a imagem com o nome (role img): o que está dentro dele não é anunciado de
       * novo. O alt fica para quando a foto for copiada ou aberta sozinha.
       */}
      {src ? <Image src={src} alt={label ?? ""} className="size-full object-cover" /> : null}
      <Fallback aria-hidden="true" className="flex size-full items-center justify-center">
        {letters || <IconUser aria-hidden="true" />}
      </Fallback>
    </Root>
  );
}
