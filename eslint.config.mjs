import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Desactiva las reglas de ESLint que Prettier ya maneja (siempre al final)
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
])

export default eslintConfig
