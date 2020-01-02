/*! NPO API Interceptor - v1.5.0 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var jsSHA = _interopDefault(require('jssha'));

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
    var parser = document.createElement('a');
    parser.href = url;

    // IE forgets to add an initial `/`, so we need to do that ourself.
    return parser.pathname.indexOf('/') === 0 ? parser.pathname : '/' + parser.pathname;
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

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

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
    var requestDate = config.date || new Date();

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

    return _Promise.resolve(config).then(function (config) {
      return _extends({}, config, {
        headers: getNpoApiHeaders(config)
      });
    });
  };
};

module.exports = createNpoApiInterceptor;
