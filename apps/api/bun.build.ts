import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'

const baseDir = import.meta.dir
/* biome ignore */
console.log('baseDir:', baseDir)
console.log('resolved:', import.meta.resolve('@youde/shared'))

await rm(join(baseDir, 'dist'), { recursive: true, force: true })

await Bun.build({
  entrypoints: [join(baseDir, 'src/main.ts')],
  outdir: join(baseDir, 'dist'),
  format: 'esm',
  target: 'bun',
  splitting: true,
  packages: 'bundle'
})

await cp(join(baseDir, 'public'), join(baseDir, 'dist/public'), { recursive: true })
