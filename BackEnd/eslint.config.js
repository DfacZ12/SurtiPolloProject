import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
   {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node, // 👉 usa variables globales de Node.js (require, module, process, etc.)
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {},
    extends: [
      js.configs.recommended, // Reglas base recomendadas
    ],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off", // Permitir console.log en backend
      "prefer-const": "warn",
    },
  },
]);
