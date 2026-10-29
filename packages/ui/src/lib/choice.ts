/**
 * Classes dos controles de escolha (Checkbox e Radio): a caixa, a camada verde de marcado e o
 * desabilitado. Cada componente soma o próprio formato (tamanho e canto).
 */

/** A caixa em repouso, com borda, foco e erro. Precisa de `data-state` (o Radix já põe). */
export const choiceBase = [
  "group relative isolate inline-flex size-4 shrink-0 items-center justify-center",
  // Como no Input, exceção consciente: em repouso a borda é subtle (abaixo dos 3:1 da WCAG),
  // para a caixa ficar leve. No hover e no foco ela vai para default (3:1), e o label nomeia.
  "border border-subtle bg-neutral text-static-white shadow-sm",
  "hover:border-default focus-visible:border-default",
  "transition-interactive duration-fast",
  // Mesmo foco do Button: surge a 4px e chega a 2px, sem animação para quem pede menos.
  "outline-focus outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2",
  "motion-reduce:outline-offset-2",
  "aria-invalid:border-danger",
];

/**
 * Estados com cursor de clique. Marcado (e indeterminado, no Checkbox) ganha o degradê e o
 * brilho no topo numa camada por cima da caixa (before), e não no fundo dela: o navegador não
 * faz fade de um degradê, mas faz da opacidade de uma camada. Assim o verde entra e sai num
 * fade rápido. A camada cobre também a borda (-inset-px) e herda o canto da caixa.
 *
 * O hover marcado repete o do Button primary: uma segunda camada (after), com o degradê mais
 * escuro e o mesmo brilho, que aparece num fade por cima da primeira.
 */
export const choiceEnabled = [
  "cursor-pointer hover:bg-neutral-hovered",
  "before:absolute before:-inset-px before:-z-10 before:rounded-[inherit]",
  "before:bg-gradient-brand before:inset-shadow-highlight",
  "before:opacity-0 before:transition-opacity before:duration-fast",
  "data-[state=checked]:before:opacity-100 data-[state=indeterminate]:before:opacity-100",
  "after:absolute after:-inset-px after:-z-10 after:rounded-[inherit]",
  "after:bg-gradient-brand-hovered after:inset-shadow-highlight",
  "after:opacity-0 after:transition-opacity after:duration-fast",
  "data-[state=checked]:hover:after:opacity-100 data-[state=indeterminate]:hover:after:opacity-100",
  // Como no Button: sem o fade do hover para quem pede menos movimento.
  "motion-reduce:after:transition-none",
];

/**
 * Desabilitado fica no lugar do `choiceEnabled`, e não por cima dele: assim o degradê de
 * marcado nunca vence o cinza de desabilitado, seja qual for a ordem das classes no CSS.
 */
export const choiceDisabled =
  "cursor-not-allowed border-disabled bg-disabled text-disabled shadow-none";
