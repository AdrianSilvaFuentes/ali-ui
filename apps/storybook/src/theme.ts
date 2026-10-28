import type { ThemeName } from "@ali/tokens";
import { createContext, useContext } from "react";

/** Tema escolhido no seletor Light/Dark da barra de ferramentas do Storybook. */
export const ThemeContext = createContext<ThemeName>("light");

export function useTheme(): ThemeName {
  return useContext(ThemeContext);
}
