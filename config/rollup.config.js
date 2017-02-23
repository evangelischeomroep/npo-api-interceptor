import replace from 'rollup-plugin-replace'

export default config => {
  return {
    entry: 'src/index.js',
    format: config.format,
    moduleName: 'npoApiInterceptor',
    dest: config.dest,
    external: [ 'jssha' ],
    globals: {
      jssha: 'JsSHA'
    },
    plugins: [
      replace({ 'process.browser': JSON.stringify(!!config.browser) })
    ]
  }
}
