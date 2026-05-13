import { cp, rm } from 'node:fs/promises'

await rm('./dist', { recursive: true, force: true })

await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: './dist',
  format: 'esm',
  target: 'bun',
  splitting: true,
  external: ['node:*', 'bun:*']
})

await cp('./public', './dist/public', { recursive: true })
