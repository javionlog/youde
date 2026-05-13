import { cp, rm } from 'node:fs/promises'
import { join } from 'node:path'

const baseDir = import.meta.dir

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
