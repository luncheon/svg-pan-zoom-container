export default {
  input: 'src/index.ts',
  output: {
    format: 'iife',
    file: 'docs/svg-pan-zoom-container.js',
    name: 'svgPanZoomContainer',
  },
  plugins: [
    require('rollup-plugin-typescript3').default(),
  ],
}
