/**
 * NPO API Interceptor
 *
 * Adds the necessary auth headers to an Axios request
 */

import encrypt from './encrypt'
import { formatDate, getObjectString, getSortedObjectString, getPathnameFromUrl } from './utils'

/**
 * URL's in use with the NPO API
 *
 * @type {Array}
 */
const NPO_API_URLS = [
  // Test
  'https://rs-test.poms.omroep.nl/v1/api',
  // Production
  'https://rs.poms.omroep.nl/v1/api'
]

/**
 * Checks whether we're intercepting a request to the POMS API
 *
 * @param   {String}  url Complete URL
 * @returns {boolean}
 */
const validateUrl = url => NPO_API_URLS.some(apiUrl => url.indexOf(apiUrl) === 0)

/**
 * Factory function for creating NPO API Interceptors
 *
 * @param   {Object}   config
 * @returns {Function}
 */
const createNpoApiInterceptor = ({ key, secret, origin = '' }) => {
  if (!key || !secret) {
    throw new Error('NPO API Interceptor: Key and secret are mandatory')
  }

  /**
   * Calculates the signed message part of the Authorization header
   *
   * @param   {Object} config      Config of the request
   * @param   {Date}   requestDate Date of the request
   * @returns {Object}
   */
  function signRequest (config, requestDate) {
    let message = {
      'origin': getOrigin(),
      'x-npo-date': formatDate(requestDate),
      'uri': getPathnameFromUrl(config.url)
    }

    if (config.params && Object.keys(config.params).length) {
      message.uri += ',' + getSortedObjectString(config.params)
    }

    return encrypt(secret, getObjectString(message))
  }

  /**
   * Determines the Authorization header value
   *
   * @param   {Object} request The request
   * @param   {Date}   requestDate Date of the request
   * @returns {String}
   */
  function getAuthorizationHeader (request, requestDate) {
    return `NPO ${key}:${signRequest(request, requestDate)}`
  }

  /**
   * Determines the Origin header value
   *
   * @returns {String}
   */
  function getOrigin () {
    if (typeof window === 'undefined') {
      return origin
    }

    return window.location.origin
  }

  /**
   * Determines the necessary NPO API headers
   *
   * @param   {Object} config Axios Request object
   * @returns {Object}
   */
  function getNpoApiHeaders (config) {
    const requestDate = config.date || new Date()

    let headers = {
      'X-NPO-Date': formatDate(requestDate),
      'Authorization': getAuthorizationHeader(config, requestDate),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json'
    }

    if (typeof window === 'undefined') {
      headers.Origin = origin
    }

    return headers
  }

  return function (config) {
    if (!validateUrl(config.url)) {
      return config
    }

    return Promise.resolve(config)
      .then(config => Object.assign({}, config, {
        headers: getNpoApiHeaders(config)
      }))
  }
}

export default createNpoApiInterceptor
