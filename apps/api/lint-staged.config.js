export default {
  '*.{js,ts,jsx,tsx,json,jsonc,css,html}': [() => 'tsc', () => 'biome check --write']
}
