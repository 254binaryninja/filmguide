/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// Use dynamic import for vite-tsconfig-paths
import { fileURLToPath } from "url";

export default async () => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default;

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./_tests_/setup.ts",
    },
  });
};
