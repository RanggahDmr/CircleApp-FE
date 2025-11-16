import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"  // ⬅ WAJIB GANTI INI

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  test: {
     root: path.resolve(__dirname),
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
