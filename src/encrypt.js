import jsSHA from 'jssha'

/**
 * Encrypts a message with a secret, using SHA256 implementation.
 *
 * Returns the base64-encoded HMAC.
 *
 * @param   {String} secret
 * @param   {String} message
 * @returns {String}
 */
const encrypt = (secret, message) => {
  /* eslint-disable new-cap */
  const sha = new jsSHA('SHA-256', 'TEXT')
  /* eslint-enable new-cap */

  sha.setHMACKey(secret, 'TEXT')
  sha.update(message)

  return sha.getHMAC('B64')
}

export default encrypt
