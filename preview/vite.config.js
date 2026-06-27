import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Single React instance across the workspace package + the preview.
  resolve: { dedupe: ["react", "react-dom"] },
  server: { port: 5179, open: false },
});
