import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {},
    rules: {
      // Don't force next/image
      "@next/next/no-img-element": "off",
      // Don't force alt for <Image/> (sourced from Sitecore media)
      "jsx-a11y/alt-text": ["warn", { elements: ["img"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrorsIgnorePattern: ".",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "jsx-quotes": ["error", "prefer-double"],
    },
    ignores: [
      ".generated/**/*",
      "**/*.d.ts",
      "**/*.js",
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
    ],
  },
];

export default eslintConfig;
