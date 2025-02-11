const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET } = process.env;

const jwtUtil = {
  /**
   * Generate a JWT.
   * @param {Object} payload - The payload to encode in the token.
   * @param {Object} [options] - Additional JWT options.
   * @param {'token'| 'refresh'} [type] - Additional JWT options.
   * @returns {string} - The signed JWT.
   */
  generateToken(payload, type = 'token', options = {},) {
    const EXPIRES_IN = type === 'token' ? JWT_EXPIRES_IN : JWT_REFRESH_EXPIRES_IN;
    const SECRET = type === 'token' ? JWT_SECRET : JWT_REFRESH_SECRET;

    return jwt.sign(payload, SECRET, {
      expiresIn: EXPIRES_IN,
      ...options,
    });
  },



  /**
   * Verify a JWT.
   * @param {string} token - The JWT to verify.
   * @param {'token'| 'refresh'} [type] - Additional JWT options.
   * @returns {Object} - The decoded payload if the token is valid.
   * @throws {Error} - If the token is invalid or expired.
   */
  verifyToken(token, type = 'token') {
    const SECRET = type === 'token' ? JWT_SECRET : JWT_REFRESH_SECRET;
    try {
      return jwt.verify(token, SECRET);
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Decode a JWT without verifying its signature.
   * @param {string} token - The JWT to decode.
   * @returns {Object} - The decoded payload.
   */
  decodeToken(token) {
    return jwt.decode(token);
  },
};

module.exports = jwtUtil;
