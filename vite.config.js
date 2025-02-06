import * as path from "path";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  build: {
    target: "es2022", //browsers can handle the latest ES features
    sourcemap: true,
  },
  resolve: {
    // required for runtime imports
    alias: {
      "/runtime/v1": path.resolve(
        import.meta.dirname,
        "./node_modules/@opendatacapture/runtime-v1/dist",
      ),
    },
  },
});
