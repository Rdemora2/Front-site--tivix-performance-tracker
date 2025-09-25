import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins:
          mode === "production" ? ["babel-plugin-react-remove-properties"] : [],
      },
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    target: "esnext",
    sourcemap: mode === "development",
    minify: "terser",
    cssMinify: "lightningcss",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Estratégia otimizada de chunking
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          "ui-vendor": [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/notifications",
          ],
          "ui-components": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-checkbox",
          ],
          "form-vendor": ["@hookform/resolvers", "@mantine/form"],
          utils: ["date-fns", "clsx", "tailwind-merge"],
        },

        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },

      external: [],

      treeshake: {
        preset: "recommended",
        manualPureFunctions: ["console.log", "console.info", "console.debug"],
      },
    },

    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },

  server: {
    port: 3000,
    host: true,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => console.log("proxy error", err));
        },
      },
    },
  },

  preview: {
    port: 3000,
    host: true,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  define: {
    __DEV__: JSON.stringify(mode === "development"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@mantine/core",
      "@mantine/hooks",
    ],
    exclude: ["@vite/client", "@vite/env"],
  },
}));
