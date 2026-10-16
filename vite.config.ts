import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import { defineConfig } from 'vite-plus'
import viteReact from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, failOnError: true },
    }),
    viteReact(),
  ],

  test: {
    include: ['tests/**/*.test.ts'],
  },

  fmt: {
    ignorePatterns: ['routeTree.gen.ts'],
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ['routeTree.gen.ts'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    '*': 'vp check --fix',
  },
})
