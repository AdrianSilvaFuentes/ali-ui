import { Root as LabelRoot } from "@radix-ui/react-label";
import type { ReactNode } from "react";
import { Toggletip } from "../toggletip/Toggletip.tsx";
import { cn } from "./cn.ts";

interface FieldLabelProps {
  /** O id do campo que o label nomeia. */
  htmlFor: string;
  /** O nome do campo. */
  children: ReactNode;
  /** Ajuda extra num Toggletip no fim do label. */
  info?: ReactNode;
  disabled?: boolean;
}

/**
 * Label dos campos (Input e Textarea), com o ícone de info opcional no fim. O ícone fica ao
 * lado do `<label>`, não dentro: dentro, o clique nele também focaria o campo.
 */
export function FieldLabel({ htmlFor, children, info, disabled }: FieldLabelProps) {
  const label = (
    <LabelRoot
      htmlFor={htmlFor}
      className={cn("text-label-md", disabled ? "text-disabled" : "text-default")}
    >
      {children}
    </LabelRoot>
  );
  if (!info) return label;

  return (
    // 6px entre o texto e o ícone: com 4px, o ícone parecia colado no label.
    <div className="flex items-center gap-1.5">
      {label}
      {/* O nome diz de qual campo é a ajuda, para quem navega pela lista de botões. */}
      <Toggletip
        label={typeof children === "string" ? `Mais informações sobre ${children}` : undefined}
      >
        {info}
      </Toggletip>
    </div>
  );
}
