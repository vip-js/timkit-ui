import { createRequire } from "module"

const require = createRequire(import.meta.url)
const sortImportsPlugin = require.resolve("@ianvs/prettier-plugin-sort-imports")

export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  plugins: [sortImportsPlugin],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
      options: {
        importOrder: [
          "^(react/(.*)$)|^(react$)",
          "^(next/(.*)$)|^(next$)",
          "<THIRD_PARTY_MODULES>",
          "",
          "^types$",
          "^@/types/(.*)$",
          "^@/config/(.*)$",
          "^@/lib/(.*)$",
          "^@/hooks/(.*)$",
          "^@/components/ui/(.*)$",
          "^@/components/(.*)$",
          "^@/registry/(.*)$",
          "^@/styles/(.*)$",
          "^@/app/(.*)$",
          "",
          "^[./]",
        ],
        importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
      },
    },
  ],
}
