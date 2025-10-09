import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/main.ts'],
  target: 'es2015',
  format: ['cjs', 'esm'],
  platform: 'neutral',
  outDir: 'dist',
  sourcemap: true,
  minify: true,
  dts: true,
  clean: true
})
