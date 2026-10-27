import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    options: {
      // Ordem da barra lateral; o que não estiver listado vem depois, em ordem alfabética.
      storySort: {
        order: [
          "Introdução",
          "Foundations",
          [
            "Colors",
            ["Primitive", "Surface", "Text", "Border", "Icon", "Semantic", "Infographics"],
            "Gradients",
            "Spacing & Layout",
            ["Spacing", "Padding", "Radius", "Shadow elevations"],
            "Typography",
            "Motion",
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
