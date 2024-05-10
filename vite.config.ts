import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
// @ts-expect-error
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ts-expect-error
      "@": resolve(__dirname, "./src/"),
    },
  },
});
