import type { ThemeName } from "@ali/tokens";
import type { Preview } from "@storybook/react-vite";
import { ThemeContext } from "../src/theme";
import { DocsContainer } from "./DocsContainer";
import "../src/styles.css";

const preview: Preview = {
  // Seletor Light/Dark na barra de ferramentas. Vale para todas as páginas.
  globalTypes: {
    theme: {
      description: "Tema claro ou escuro",
      toolbar: {
        title: "Tema",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as ThemeName;
      // No <html>, para o fundo da página e os componentes seguirem o tema.
      document.documentElement.setAttribute("data-theme", theme);
      return (
        <ThemeContext.Provider value={theme}>
          <Story />
        </ThemeContext.Provider>
      );
    },
  ],
  parameters: {
    docs: {
      // A aba Docs troca de tema junto com o seletor Light/Dark.
      container: DocsContainer,
    },
    options: {
      // Ordem da barra lateral; o que não estiver listado vem depois, em ordem alfabética.
      storySort: {
        order: [
          "Introdução",
          "Foundations",
          [
            "Colors",
            [
              "Primitive",
              "Surface",
              "Background",
              "Text",
              "Border",
              "Icon",
              "Semantic",
              "Infographics",
            ],
            "Gradients",
            "Spacing & Layout",
            ["Spacing", "Padding", "Radius", "Shadow"],
            "Typography",
            "Icons",
            "Motion",
          ],
          "Components",
          // Button e Toggletip servem a qualquer tela; os campos ficam juntos em Form, dos de
          // texto para os de escolha.
          [
            "Button",
            "Toggletip",
            "Form",
            ["Input", "Textarea", "Select", "Checkbox", "RadioGroup", "Switch"],
          ],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
