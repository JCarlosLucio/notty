import js from "@eslint/js";
import { flatConfig as nextFlatConfig } from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import { configs as tseslint } from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "**/.next",
    "**/dist",
    "**/node_modules/",
    "**/public",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  js.configs.recommended,
  eslintConfigPrettier,
  tseslint.recommendedTypeChecked,
  tseslint.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  reactPlugin.configs.flat.recommended ?? {},
  reactPlugin.configs.flat["jsx-runtime"] ?? {},
  reactHooks.configs.flat["recommended-latest"] ?? {},
  // @ts-expect-error nextFlatConfig types are wrong but works
  nextFlatConfig.recommended,
  nextFlatConfig.coreWebVitals,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    plugins: {
      importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Default
      eqeqeq: "error",
      "no-console": "warn",
      "prefer-const": "error",
      //Import
      "import/no-named-as-default": "off",
      //Typescript
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": [
        "error",
        {
          allowDeclarations: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
            arguments: false,
          },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      //Simple-import-sort
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // Next
      "@next/next/no-html-link-for-pages": "error",
      // React
      "react/no-unknown-property": "off",
      "react/button-has-type": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/function-component-definition": [
        2,
        {
          namedComponents: "function-declaration",
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
          bun: false, // Resolve Bun modules (https://github.com/import-js/eslint-import-resolver-typescript#bun)
          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json or <root>/jsconfig.json by default
          // Use <root>/path/to/folder/tsconfig.json or <root>/path/to/folder/jsconfig.json
          project: "./tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
    },
  },
);
