import { duration, vars } from "@ali/tokens";
// Cor de marca direto do primitivo, só para ilustrar a documentação.
import { primary } from "@ali/tokens/primitives";
import { useState } from "react";
import { Section, Table, TokensLayout } from "./TokensLayout";

const usage: Record<keyof typeof duration, string> = {
  instant: "Mudanças sem animação.",
  fast: "Hover, foco e pequenos estados.",
  base: "Abrir e fechar elementos pequenos.",
  slow: "Movimentos maiores, como painéis.",
};

/** Botão que move um ponto com a duração do token, para comparar a velocidade. */
function DurationDemo({ name }: { name: keyof typeof duration }) {
  const [moved, setMoved] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setMoved((value) => !value)}
        aria-pressed={moved}
        className="rounded-sm border border-strong bg-surface-raised px-3 py-0.5 text-label-md hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Testar
      </button>
      <div className="relative h-3 w-24 rounded-full bg-surface-sunken ring-1 ring-default">
        <div
          className="absolute top-0 left-0 size-3 rounded-full transition-transform motion-reduce:transition-none"
          style={{
            transitionDuration: vars.duration[name],
            backgroundColor: primary[600],
            transform: moved
              ? "translateX(calc(var(--ali-spacing-24) - var(--ali-spacing-3)))"
              : "none",
          }}
        />
      </div>
    </div>
  );
}

export function DurationTokensPage() {
  return (
    <TokensLayout title="Durations" description="Animações curtas, por velocidade.">
      {() => (
        <Section
          title="Escala"
          description="Use com o utilitário duration: duration-fast. Quem pede menos movimento no sistema não vê a animação."
        >
          <Table columns={["Token", "Valor", "Uso", "Exemplo"]}>
            {(Object.keys(duration) as (keyof typeof duration)[]).map((name) => (
              <tr key={name} className="border-t border-default align-middle">
                <td className="px-4 py-3 text-label-md whitespace-nowrap">duration-{name}</td>
                <td className="px-4 py-3 font-mono text-body-md">{duration[name]}</td>
                <td className="px-4 py-3 text-body-md text-subtle">{usage[name]}</td>
                <td className="px-4 py-3">
                  <DurationDemo name={name} />
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      )}
    </TokensLayout>
  );
}
