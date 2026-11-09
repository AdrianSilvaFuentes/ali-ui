import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "../button/Button.tsx";
import { cn } from "../lib/cn.ts";
import { FieldLabel } from "../lib/FieldLabel.tsx";
import { FieldError, FieldHelp } from "../lib/FieldMessage.tsx";

/**
 * A área de arrastar: borda tracejada border-default sobre fundo neutral-subtle, canto de 12px
 * (o do Input md). Pelo menos 128px de altura (spacing-32), com o conteúdo no meio: a altura
 * fica na escala, e não na soma das linhas de texto. No hover, o fundo escurece um tom. Com um arquivo por cima, a borda e o
 * fundo vão para a cor da marca: "pode soltar". Com erro, a borda fica vermelha.
 */
export const fileUploadVariants = cva([
  "group flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 p-4",
  "rounded-xl border border-dashed border-default bg-neutral-subtle text-center",
  "transition-interactive duration-fast",
  "hover:bg-neutral-hovered data-dragging:border-primary data-dragging:bg-primary-subtle",
  "data-invalid:border-danger",
  // Mesmo foco do Button: surge a 4px e chega a 2px, sem animação para quem pede menos.
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "motion-reduce:outline-offset-2",
  "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled",
]);

export interface FileUploadProps {
  /** Nome do campo, acima da área. Sem label, passe um `aria-label`. */
  label?: ReactNode;
  /** Ajuda extra num ícone de info no fim do label, que abre um Toggletip. Precisa de `label`. */
  labelInfo?: ReactNode;
  /** O que a área aceita, em uma linha dentro dela: "PDF ou PNG, até 5 MB". */
  hint?: ReactNode;
  /** Texto de ajuda abaixo da área, lido pelo leitor de tela junto com o label. */
  description?: ReactNode;
  /** Mensagem de erro. Substitui a ajuda e aparece com ícone, não só em vermelho. */
  error?: ReactNode;
  /** Tipos aceitos, como no input de arquivo: ".pdf,image/png" ou "image/*". */
  accept?: string;
  /** Tamanho máximo de cada arquivo, em bytes. */
  maxSize?: number;
  /** Aceita vários arquivos. Sem ele, um arquivo novo troca o anterior. */
  multiple?: boolean;
  /** Os arquivos, controlados por fora. */
  value?: File[];
  /** Os arquivos ao abrir, sem controlar o estado. */
  defaultValue?: File[];
  /** Avisa a lista nova a cada arquivo adicionado ou removido. */
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  /** Nome no formulário: os arquivos vão junto ao enviar. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  /** Classes do bloco inteiro (label, área, lista e mensagens), por exemplo a largura. */
  className?: string;
}

/** Tamanho em bytes, KB ou MB, com vírgula: "1,2 MB". */
export function formatFileSize(bytes: number) {
  const units = ["bytes", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: unit < 2 ? 0 : 1 });
  return `${number.format(size)} ${units[unit]}`;
}

/** Confere o arquivo contra o `accept`: extensões (".pdf"), tipos ("image/png") e grupos ("image/*"). */
function accepts(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .some((rule) =>
      rule.startsWith(".")
        ? name.endsWith(rule)
        : rule.endsWith("/*")
          ? type.startsWith(rule.slice(0, -1))
          : type === rule,
    );
}

/**
 * Área para arrastar arquivos, ou clicar e escolher. Os escolhidos aparecem numa lista abaixo,
 * com tamanho e um X para remover. Arquivos de tipo errado ou grandes demais ficam de fora, com
 * um aviso que diz qual e por quê. Pelo teclado, a área é um botão: Enter ou Espaço abrem a
 * escolha de arquivos.
 */
export function FileUpload({
  label,
  labelInfo,
  hint,
  description,
  error,
  accept,
  maxSize,
  multiple = false,
  value,
  defaultValue = [],
  onFilesChange,
  disabled,
  name,
  id,
  "aria-label": ariaLabel,
  className,
}: FileUploadProps) {
  const autoId = useId();
  const zoneId = id ?? autoId;
  const labelId = label ? `${zoneId}-label` : undefined;
  const hintId = hint ? `${zoneId}-hint` : undefined;

  const [ownFiles, setOwnFiles] = useState<File[]>(defaultValue);
  const files = value ?? ownFiles;
  const [rejected, setRejected] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // O erro de quem usa vence o aviso de arquivo recusado; os dois substituem a ajuda.
  const message = error ?? rejected;
  const showDescription = Boolean(description) && !message;
  const descriptionId = showDescription ? `${zoneId}-description` : undefined;
  const errorId = message ? `${zoneId}-error` : undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Depois de remover, o foco vai para o X do próximo arquivo, ou de volta para a área.
  const focusAfterRemove = useRef<number | null>(null);

  // O input escondido carrega os arquivos da lista, para irem junto com o formulário.
  useEffect(() => {
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    const transfer = new DataTransfer();
    for (const file of files) transfer.items.add(file);
    input.files = transfer.files;
  }, [files]);

  useEffect(() => {
    const index = focusAfterRemove.current;
    if (index === null) return;
    focusAfterRemove.current = null;
    const buttons = listRef.current?.querySelectorAll("button");
    (buttons?.[Math.min(index, buttons.length - 1)] ?? zoneRef.current)?.focus();
  });

  const setFiles = (next: File[]) => {
    if (value === undefined) setOwnFiles(next);
    onFilesChange?.(next);
  };

  /** Separa os aceitos dos recusados e diz por que cada um ficou de fora. */
  const add = (incoming: File[]) => {
    if (disabled || incoming.length === 0) return;
    const picked = multiple ? incoming : incoming.slice(0, 1);
    const reasons: string[] = [];
    const ok = picked.filter((file) => {
      if (!accepts(file, accept)) {
        reasons.push(`${file.name} não é de um tipo aceito.`);
        return false;
      }
      if (maxSize !== undefined && file.size > maxSize) {
        reasons.push(`${file.name} passa de ${formatFileSize(maxSize)}.`);
        return false;
      }
      return true;
    });
    setRejected(reasons.length > 0 ? reasons.join(" ") : null);
    if (ok.length === 0) return;
    setFiles(multiple ? [...files, ...ok] : ok);
    setAnnouncement(
      ok.length === 1 ? `${ok[0]?.name} adicionado.` : `${ok.length} arquivos adicionados.`,
    );
  };

  const remove = (index: number) => {
    const file = files[index];
    focusAfterRemove.current = index;
    setFiles(files.filter((_, i) => i !== index));
    setAnnouncement(`${file?.name} removido.`);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    add([...event.dataTransfer.files]);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    // Sem o preventDefault, o navegador abre o arquivo em vez de soltar aqui.
    event.preventDefault();
    if (!disabled) setDragging(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    add([...(event.target.files ?? [])]);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <FieldLabel id={labelId} info={labelInfo} disabled={disabled}>
          {label}
        </FieldLabel>
      ) : null}
      <button
        ref={zoneRef}
        id={zoneId}
        type="button"
        disabled={disabled}
        // O nome é o label; a dica e o que a área faz vêm como descrição.
        aria-labelledby={labelId}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={
          [`${zoneId}-action`, hintId, descriptionId, errorId].filter(Boolean).join(" ") ||
          undefined
        }
        data-dragging={dragging || undefined}
        data-invalid={message ? true : undefined}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={fileUploadVariants()}
      >
        <IconUpload
          aria-hidden="true"
          className={cn(
            "mb-1 size-5 text-icon-subtle",
            "group-data-dragging:text-icon-primary group-disabled:text-icon-disabled",
          )}
        />
        <span
          id={`${zoneId}-action`}
          className="text-label-md text-default group-disabled:text-disabled"
        >
          {multiple ? "Arraste arquivos ou " : "Arraste um arquivo ou "}
          <span className="text-link group-disabled:text-disabled">escolha</span>
        </span>
        {hint ? (
          <span id={hintId} className="text-body-sm text-subtle group-disabled:text-disabled">
            {hint}
          </span>
        ) : null}
      </button>
      {/* O input de verdade fica escondido: a área faz o papel dele, para o mouse e o teclado. */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={handleInputChange}
      />
      {files.length > 0 ? (
        <ul ref={listRef} aria-label="Arquivos escolhidos" className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li
              // Nome, tamanho e data juntos identificam o arquivo; o índice desempata repetidos.
              // biome-ignore lint/suspicious/noArrayIndexKey: o mesmo arquivo pode entrar duas vezes.
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className={cn(
                "flex h-10 items-center gap-2 rounded-lg border border-subtle bg-surface pr-1 pl-3",
                disabled && "text-disabled",
              )}
            >
              <IconFile
                aria-hidden="true"
                className={cn(
                  "size-5 shrink-0",
                  disabled ? "text-icon-disabled" : "text-icon-subtle",
                )}
              />
              <span className="min-w-0 flex-1 truncate text-body-md">{file.name}</span>
              <span className="shrink-0 text-body-sm text-subtle tabular-nums">
                {formatFileSize(file.size)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Remover ${file.name}`}
                disabled={disabled}
                onClick={() => remove(index)}
                className="w-8 shrink-0 px-0"
              >
                <IconX aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <span role="status" className="sr-only">
        {announcement}
      </span>
      {showDescription ? <FieldHelp id={descriptionId}>{description}</FieldHelp> : null}
      {message ? <FieldError id={errorId}>{message}</FieldError> : null}
    </div>
  );
}
