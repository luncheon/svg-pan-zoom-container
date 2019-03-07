export default {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    file: 'docs/svg-pan-zoom-select.js',
    name: 'svgPanZoomSelect',
  },
  plugins: [
    require('rollup-plugin-typescript3').default(),
  ],
}
