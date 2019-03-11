import { name } from './package.json'

export default {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    file: `docs/${name}.js`,
    name: name.replace(/-[a-z]/g, $0 => $0[1].toUpperCase()),
  },
  plugins: [
    require('rollup-plugin-typescript3').default(),
  ],
}
