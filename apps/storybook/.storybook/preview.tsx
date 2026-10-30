import type { BrandName, ThemeName } from "@ali/tokens";
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
    // Seletor da cor de marca: troca a paleta do primary em todas as páginas, para testar
    // a interface com outra marca. Os tokens de status (erro, sucesso...) não mudam.
    brand: {
      description: "Cor de marca",
      toolbar: {
        title: "Marca",
        icon: "paintbrush",
        items: [
          { value: "teal", title: "Teal (padrão)" },
          { value: "blue", title: "Blue" },
          { value: "green", title: "Green" },
          { value: "orange", title: "Orange" },
          { value: "red", title: "Red" },
          { value: "yellow", title: "Yellow" },
        ],
        dynamicTitle: true,
      },
    },
    // Modo mais contraste, como o Aumentar contraste do iOS: "Sistema" segue a preferência
    // do computador; "Mais" liga; "Padrão" desliga mesmo com a preferência ligada.
    contrast: {
      description: "Contraste",
      toolbar: {
        title: "Contraste",
        icon: "contrast",
        items: [
          { value: "system", title: "Sistema" },
          { value: "standard", title: "Padrão" },
          { value: "more", title: "Mais contraste" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", brand: "teal", contrast: "system" },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as ThemeName;
      // No <html>, para o fundo da página e os componentes seguirem o tema.
      document.documentElement.setAttribute("data-theme", theme);
      // A marca também vai no <html>: o CSS dos tokens troca as cores de marca por ela.
      document.documentElement.setAttribute(
        "data-brand",
        (context.globals.brand as BrandName | undefined) ?? "teal",
      );
      const contrast = context.globals.contrast as string | undefined;
      if (contrast === "more" || contrast === "standard") {
        document.documentElement.setAttribute("data-contrast", contrast);
      } else {
        document.documentElement.removeAttribute("data-contrast");
      }
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
            "Contrast",
          ],
          "Components",
          // Button e Toggletip servem a qualquer tela; os campos ficam juntos em Form, dos de
          // texto para os de escolha.
          [
            "Button",
            "Toggletip",
            "Form",
            ["Visão geral", "Input", "Textarea", "Select", "Checkbox", "RadioGroup", "Switch"],
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
