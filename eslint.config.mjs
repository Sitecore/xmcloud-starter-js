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
    rules: {
      // Don't force next/image
      "@next/next/no-img-element": "off",
      // Don't force alt for <Image/> (sourced from Sitecore media)
      "jsx-a11y/alt-text": "off",
      // TypeScript rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "caughtErrorsIgnorePattern": "."
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "jsx-quotes": ["error", "prefer-double"]
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".generated/**/*",
      "**/*.d.ts",
      "**/*.js"
    ],
  },
];

export default eslintConfig;
