import { color, radius, type ThemeName } from "@ali/tokens";
import { DocsContainer as BaseContainer } from "@storybook/addon-docs/blocks";
import type { ComponentProps } from "react";
import { create } from "storybook/theming";

/** Tema da aba Docs para cada modo, montado com os tokens da Ali UI. */
function docsTheme(theme: ThemeName) {
  return create({
    base: theme,
    // Cantos das caixas de preview e das tabelas de props: radius-2xl, em pixels.
    appBorderRadius: Number.parseFloat(radius["2xl"]) * 16,
    appBorderColor: color["border-subtle"][theme],
    appBg: color["surface-sunken"][theme],
    appContentBg: color.surface[theme],
    appPreviewBg: color.surface[theme],
    barBg: color.surface[theme],
    textColor: color["text-default"][theme],
    textMutedColor: color["text-subtle"][theme],
  });
}

const themes = { light: docsTheme("light"), dark: docsTheme("dark") };

/** Aba Docs que segue o seletor Light/Dark da barra de ferramentas. */
export function DocsContainer(props: ComponentProps<typeof BaseContainer>) {
  const { context } = props as unknown as {
    context: { store: { userGlobals: { get(): { theme?: ThemeName } } } };
  };
  const theme = context.store.userGlobals.get().theme ?? "light";
  return <BaseContainer {...props} theme={themes[theme]} />;
}
