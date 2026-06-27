import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // One React instance across the app + the core package.
  resolve: { dedupe: ["react", "react-dom"] },
  server: { port: 5180, open: false },
});
