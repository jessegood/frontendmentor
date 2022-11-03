import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  build: {
    target: "esnext",
  },
  assetsInclude: ["./images/avatars/*.png"],
});
