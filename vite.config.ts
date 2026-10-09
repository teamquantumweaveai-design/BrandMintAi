import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { voiceProxyPlugin } from "./server/vite-plugin.mjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), voiceProxyPlugin()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, "index.html"), voiceDiagnostics: path.resolve(__dirname, "voice-diagnostics.html") } } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
