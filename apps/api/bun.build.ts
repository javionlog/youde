console.log('build start')
await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: './dist',
  format: 'esm',
  target: 'bun',
  splitting: true
})
console.log('build end')
