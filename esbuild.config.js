const esbuild = require('esbuild')
const aliasPlugin = require('esbuild-plugin-path-alias')
const eslint = require('esbuild-plugin-eslint')
const path = require('path')

const isDevMode = () => process.env.NODE_ENV === 'development'

const showMessage = () => {
  const envMessage = isDevMode() ? 'Develop Mode' : 'Production Mode'
  console.log('==========================================')
  console.log(`=         Running: ${envMessage}          =`)
  console.log('==========================================')
}

const config = {
  entryPoints: ['src/main.js', 'src/assets/styles/main.css'],
  outdir: 'dist',
  bundle: true,
  splitting: true,
  treeShaking: !isDevMode(),
  keepNames: true,
  sourcemap: !!isDevMode(),
  minify: !isDevMode(),
  format: 'esm',
  target: isDevMode() ? ['esnext'] : ['es2018'],
  loader: {
    '.png': 'dataurl',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'text'
  },
  plugins: [
    aliasPlugin({
      '@/components': path.resolve(__dirname, './src/components'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }),
    eslint({})
  ]
}

esbuild
  .build(config)
  .then(showMessage)
  .catch(() => process.exit(1))
