export default {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    file: 'iife/index.js',
    name: require('./package.json').name.replace(/-[a-z]/g, $0 => $0[1].toUpperCase()),
  },
  plugins: [
    require('rollup-plugin-typescript3').default({ compilerOptions: { outDir: 'iife/' } }),
  ],
}
