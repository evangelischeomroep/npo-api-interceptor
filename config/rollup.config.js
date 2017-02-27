import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

const pkg = require('../package.json')

export default config => {
  return {
    entry: 'src/index.js',
    format: config.format,
    moduleName: 'npoApiInterceptor',
    dest: config.dest,
    banner: `/*! NPO API Interceptor - v${pkg.version} */`,
    external: [ 'jssha' ],
    globals: {
      jssha: 'jsSHA'
    },
    plugins: [
      babel(),
      replace({ 'process.browser': JSON.stringify(!!config.browser) })
    ]
  }
}
