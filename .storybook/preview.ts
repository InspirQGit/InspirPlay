import type { Preview } from "@storybook/react-vite";
import "../src/legacy/styles/fonts.css";
import "../src/legacy/styles/tailwind.css";
import "../src/legacy/styles/theme.css";
import "../src/legacy/styles/globals.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "error" },
    controls: { expanded: true },
    layout: "centered",
  },
};

export default preview;
