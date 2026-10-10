import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { voiceProxyPlugin } from "./server/vite-plugin.mjs";
import { resolveVoiceEndpoints } from "./src/components/floating/voiceEndpoints";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const backendUrl = loadEnv(mode, process.cwd(), "VITE_").VITE_VOICE_BACKEND_URL || "";
  if (backendUrl) resolveVoiceEndpoints(backendUrl, "https://brandmintai.io");
  return {
    define: { __VOICE_BACKEND_URL__: JSON.stringify(backendUrl) },
    plugins: [react(), voiceProxyPlugin()],
    build: { rollupOptions: { input: { main: path.resolve(__dirname, "index.html"), voiceDiagnostics: path.resolve(__dirname, "voice-diagnostics.html") } } },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
