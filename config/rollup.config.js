export default config => {
  return {
    entry: 'src/index.js',
    format: config.format,
    moduleName: 'npoApiInterceptor',
    dest: config.dest
  }
}
