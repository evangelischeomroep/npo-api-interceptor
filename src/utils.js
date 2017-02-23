/**
 * Returns a comma-separated `key:value` string representation of an object
 *
 * @param   {Object} obj
 * @returns {String}
 */
export const getObjectString = obj =>
  Object.keys(obj)
    .map(key => key + ':' + obj[key])
    .join()

/**
 * Returns a ordered comma-separated `key:value` string representation of an object
 *
 * @param   {Object} obj
 * @returns {String}
 */
export const getSortedObjectString = obj =>
  Object.keys(obj)
    .sort()
    .map(key => key + ':' + obj[key])
    .join()

/**
 * Parses a URL and returns the pathname
 *
 * @param   {String} url
 * @returns {String}
 */
export const getPathnameFromUrl = url => {
  if (process.browser) {
    const parser = document.createElement('a')
    parser.href = url

    // IE forgets to add an initial `/`, so we need to do that ourself.
    return (parser.pathname.indexOf('/') === 0) ? parser.pathname : '/' + parser.pathname;
  } else {
    const parser = require('url')

    return parser.parse(url).pathname
  }
}

/**
 * Formats a given date to the necessary format
 *
 * @param   {Date} date
 * @returns {String}
 */
export const formatDate = date => date.toUTCString()
