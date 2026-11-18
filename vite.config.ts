import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config. The path alias (@/) is deliberately NOT used — aliases are
// fragile in the Sandpack preview, so imports are relative.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
