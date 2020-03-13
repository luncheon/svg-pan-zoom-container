const now = () => new Date().toLocaleTimeString()
console.log(`[${now()}] build started`)

const options = {
  rollup: {
    input: 'es/index.js',
    output: {
      format: 'iife',
      file: 'iife/index.js',
      name: require('./package.json').name.replace(/-[a-z]/g, $0 => $0[1].toUpperCase()),
    },
  },
  minify: {
    compress: {
      passes: 4,
    },
    output: {
      semicolons: false,
    },
  },
}

const ts = require('typescript')
const { rollup } = require('rollup')
const { minify } = require('uglify-js')
const gzipSize = require('gzip-size')
const fs = require('fs')

const tsDiagnosticLoggers = {
  [ts.DiagnosticCategory.Error]: console.error,
  [ts.DiagnosticCategory.Warning]: console.warn,
  [ts.DiagnosticCategory.Suggestion]: console.info,
  [ts.DiagnosticCategory.Message]: console.info,
}

const tsConfig = ts.parseJsonConfigFileContent(require('./tsconfig.json'), ts.sys, '.')
if (tsConfig.errors.length) {
  throw tsConfig.errors
}

function tsBuild(fileNames, options) {
  const program = ts.createProgram(fileNames, options)
  const emitResult = program.emit()
  ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics).forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      tsDiagnosticLoggers[diagnostic.category](`${diagnostic.file.fileName} (${line + 1},${character + 1}):\n[${diagnostic.code}][${ts.DiagnosticCategory[diagnostic.category]}] ${message}\n`)
    } else {
      tsDiagnosticLoggers[diagnostic.category](`[${diagnostic.code}][${ts.DiagnosticCategory[diagnostic.category]}] ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
    }
  })
  if (ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics).some(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)) {
    console.error('build error\n')
    process.exit(1)
  }
}

console.log(`[${now()}] building es module...`)
tsBuild(tsConfig.fileNames, tsConfig.options)

console.log(`[${now()}] building cjs module...`)
tsBuild(tsConfig.fileNames, { ...tsConfig.options, module: ts.ModuleKind.CommonJS, outDir: 'cjs' })

console.log(`[${now()}] building iife...`)
rollup(options.rollup)
  .then(bundle => bundle.write(options.rollup.output))
  .then(output => {
    console.log(`[${now()}] building minified iife...`)
    if (output.output.length !== 1) {
      throw Error(`output length is ${output.length} but 1 is required`)
    }
    const minification = minify(output.output[0].code, options.minify)
    if (minification.warnings) {
      console.warn(minification.warnings)
    }
    if (minification.error) {
      throw minification.error
    }
    if (minification.code) {
      fs.writeFileSync(options.rollup.output.file.replace(/\.js$/, '.min.js'), minification.code, 'utf8')
      fs.existsSync('docs') || fs.mkdirSync('docs')
      fs.writeFileSync('docs/index.js', output.output[0].code, 'utf8')
      fs.writeFileSync('docs/index.min.js', minification.code, 'utf8')
      return gzipSize(minification.code)
    } else {
      throw Error('no code emitted')
    }
  })
  .then(gzippedSize => console.log(`[${now()}] build complete\nminified gzipped iife module size: ${gzippedSize} B (${gzippedSize / 1024} kB)\n`))
