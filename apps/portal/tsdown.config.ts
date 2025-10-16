import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./server.js'],
  outDir: 'build',
  noExternal: () => true
})
