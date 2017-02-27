/*! NPO API Interceptor - v1.0.0 */
import jsSHA from 'jssha';

/**
 * Encrypts a message with a secret, using SHA256 implementation.
 *
 * Returns the base64-encoded HMAC.
 *
 * @param   {String} secret
 * @param   {String} message
 * @returns {String}
 */
var encrypt = function encrypt(secret, message) {
  /* eslint-disable new-cap */
  var sha = new jsSHA('SHA-256', 'TEXT');
  /* eslint-enable new-cap */

  sha.setHMACKey(secret, 'TEXT');
  sha.update(message);

  return sha.getHMAC('B64');
};

/**
 * Returns a comma-separated `key:value` string representation of an object
 *
 * @param   {Object} obj
 * @returns {String}
 */
var getObjectString = function getObjectString(obj) {
  return Object.keys(obj).map(function (key) {
    return key + ':' + obj[key];
  }).join();
};

/**
 * Returns a ordered comma-separated `key:value` string representation of an object
 *
 * @param   {Object} obj
 * @returns {String}
 */
var getSortedObjectString = function getSortedObjectString(obj) {
  return Object.keys(obj).sort().map(function (key) {
    return key + ':' + obj[key];
  }).join();
};

/**
 * Parses a URL and returns the pathname
 *
 * @param   {String} url
 * @returns {String}
 */
var getPathnameFromUrl = function getPathnameFromUrl(url) {
  {
    var _parser = require('url');

    return _parser.parse(url).pathname;
  }
};

/**
 * Formats a given date to the necessary format
 *
 * @param   {Date} date
 * @returns {String}
 */
var formatDate = function formatDate(date) {
  return date.toUTCString();
};

/**
 * NPO API Interceptor
 *
 * Adds the necessary auth headers to an Axios request
 */

/**
 * URL's in use with the NPO API
 *
 * @type {Array}
 */
var NPO_API_URLS = [
// Test
'https://rs-test.poms.omroep.nl/v1/api',
// Production
'https://rs.poms.omroep.nl/v1/api'];

/**
 * Checks whether we're intercepting a request to the POMS API
 *
 * @param   {String}  url Complete URL
 * @returns {boolean}
 */
var validateUrl = function validateUrl(url) {
  return NPO_API_URLS.some(function (apiUrl) {
    return url.indexOf(apiUrl) === 0;
  });
};

/**
 * Factory function for creating NPO API Interceptors
 *
 * @param   {Object}   config
 * @returns {Function}
 */
var createNpoApiInterceptor = function createNpoApiInterceptor(_ref) {
  var key = _ref.key,
      secret = _ref.secret,
      _ref$origin = _ref.origin,
      origin = _ref$origin === undefined ? '' : _ref$origin;

  if (!key || !secret) {
    throw new Error('NPO API Interceptor: Key and secret are mandatory');
  }

  /**
   * Calculates the signed message part of the Authorization header
   *
   * @param   {Object} config      Config of the request
   * @param   {Date}   requestDate Date of the request
   * @returns {Object}
   */
  function signRequest(config, requestDate) {
    var message = {
      'origin': getOrigin(),
      'x-npo-date': formatDate(requestDate),
      'uri': getPathnameFromUrl(config.url)
    };

    if (config.params && Object.keys(config.params).length) {
      message.uri += ',' + getSortedObjectString(config.params);
    }

    return encrypt(secret, getObjectString(message));
  }

  /**
   * Determines the Authorization header value
   *
   * @param   {Object} request The request
   * @param   {Date}   requestDate Date of the request
   * @returns {String}
   */
  function getAuthorizationHeader(request, requestDate) {
    return 'NPO ' + key + ':' + signRequest(request, requestDate);
  }

  /**
   * Determines the Origin header value
   *
   * @returns {String}
   */
  function getOrigin() {
    if (typeof window === 'undefined') {
      return origin;
    }

    return window.location.origin;
  }

  /**
   * Determines the necessary NPO API headers
   *
   * @param   {Object} config Axios Request object
   * @returns {Object}
   */
  function getNpoApiHeaders(config) {
    var requestDate = new Date();

    var headers = {
      'X-NPO-Date': formatDate(requestDate),
      'Authorization': getAuthorizationHeader(config, requestDate),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (typeof window === 'undefined') {
      headers.Origin = origin;
    }

    return headers;
  }

  return function (config) {
    if (!validateUrl(config.url)) {
      return config;
    }

    return Promise.resolve(config).then(function (config) {
      return Object.assign({}, config, {
        headers: getNpoApiHeaders(config)
      });
    });
  };
};

export default createNpoApiInterceptor;
