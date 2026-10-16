import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import { defineConfig, type Plugin } from 'vite-plus'
import viteReact from '@vitejs/plugin-react'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { rehypeOutline } from './src/content/outline'
import { writeSeoFiles } from './src/sitemap'

/**
 * Write the sitemap and robots.txt from the pages the prerender actually wrote.
 */
function seoFiles(): Plugin {
  return {
    name: 'carlouinely:seo-files',
    apply: 'build',
    // Both levels of ordering are needed to land after `tanstackStart`'s
    // post-build plugin, which is where the prerender runs.
    enforce: 'post',
    buildApp: {
      order: 'post',
      async handler(builder) {
        writeSeoFiles({ clientDir: builder.environments.client.config.build.outDir })
      },
    },
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      // `rehype-slug` gives every heading its stable id; `rehypeOutline` then
      // exports the level-2 headings so the Case Study can build its contents.
      rehypePlugins: [rehypeSlug, rehypeOutline],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, failOnError: true },
    }),
    viteReact(),
    seoFiles(),
  ],

  test: {
    include: ['tests/**/*.test.ts'],
  },

  // Vendored skills under `.agents/skills/` are third-party content, and
  // `skills-lock.json` pins each one by content hash. Reformatting them to
  // satisfy this project's rules would diverge the install from the version the
  // lock records, so they are left exactly as installed.
  fmt: {
    ignorePatterns: ['routeTree.gen.ts', '.agents/skills/**'],
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ['routeTree.gen.ts', '.agents/skills/**'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    '*': 'vp check --fix',
  },
})
