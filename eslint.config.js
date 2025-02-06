import path from "path";

import { config } from "@douglasneuroinformatics/eslint-config";

export default config(
  {
    typescript: {
      enabled: true,
      project: path.resolve(import.meta.dirname, "tsconfig.json"),
    },
  },
  { rules: { "perfectionist/sort-objects": "off" } },
);
