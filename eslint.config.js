import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import astro from "eslint-plugin-astro"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
  globalIgnores(["dist/", ".astro/", ".agents/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    rules: {
      // src/assets/projects/ belongs to the panel, which adds, renames and
      // deletes those photographs on every project edit. Code that imports one
      // breaks the build the moment it goes; a photo a page needs lives in
      // src/assets/pages/ instead, where only this repository changes it.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/assets/projects/**"],
              message:
                "Project photos are managed from the panel and can disappear. Copy the photo into src/assets/pages/ and import it from there.",
            },
          ],
        },
      ],
    },
  },
)
