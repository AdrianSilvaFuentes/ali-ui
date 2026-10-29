import { IconAlertCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { cn } from "./cn.ts";

interface FieldMessageProps {
  /** O id que o campo aponta no `aria-describedby`. */
  id?: string;
  children: ReactNode;
  /** Classes extras, como o recuo que alinha a mensagem com o label nos controles de escolha. */
  className?: string;
}

/** Ajuda abaixo de um campo (Input, Textarea, Checkbox, Radio e Switch). */
export function FieldHelp({ id, children, className }: FieldMessageProps) {
  return (
    <p id={id} className={cn("text-body-md text-subtle", className)}>
      {children}
    </p>
  );
}

/**
 * Mensagem de erro, com ícone e texto: a cor nunca é o único aviso. O ícone fica numa caixa
 * de uma linha de altura (1lh), alinhada ao topo: assim ele acompanha a primeira linha, mesmo
 * quando a mensagem quebra em várias.
 */
export function FieldError({ id, children, className }: FieldMessageProps) {
  return (
    <p id={id} className={cn("flex items-start gap-1.5 text-body-md text-danger", className)}>
      <span className="flex h-[1lh] shrink-0 items-center">
        <IconAlertCircle aria-hidden="true" className="size-4 text-icon-danger" />
      </span>
      {children}
    </p>
  );
}
