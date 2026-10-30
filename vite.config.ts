import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // /ai-workforce/ is its own page with its own CSS, outside the React Router app.
      input: {
        main: path.resolve(__dirname, "index.html"),
        aiWorkforce: path.resolve(__dirname, "ai-workforce/index.html"),
      },
    },
  },
});
