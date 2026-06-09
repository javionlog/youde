export default {
  '*.{js,ts,jsx,tsx,json,jsonc,css,html}': [
    () => 'tsc',
    () => 'oxlint --fix --ignore-pattern public',
    () => 'oxfmt'
  ]
}
