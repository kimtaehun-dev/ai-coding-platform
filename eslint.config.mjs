import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.stories.@(ts|tsx|js|jsx)", ".storybook/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/*.stories", "**/*.stories.*"],
              message:
                "Stories must not be imported from production code — they would leak into the Next.js bundle.",
            },
            {
              group: ["@storybook/*", "storybook"],
              message:
                "Storybook packages are devDependencies. Import only inside .stories.* files or .storybook/.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
