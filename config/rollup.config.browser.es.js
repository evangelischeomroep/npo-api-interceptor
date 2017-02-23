import config from './rollup.config'

export default config({
  format: 'es',
  dest: 'lib/npoapiinterceptor.browser.es.js',
  browser: true
})
