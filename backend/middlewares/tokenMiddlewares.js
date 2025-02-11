const jwtUtil = require("../utils/jwtUtil");
const userService = require("../services/user.service");

/**
 * Middleware to validate JWT tokens.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async function tokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token is missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtUtil.verifyToken(token);

    if (decoded.type !== 'token') {
      return res.status(401).json({ message: "Invalid token type." });
    }

    const userData = await userService.findUserById(decoded.id);
    if (!userData) {
      return res.status(401).json({ message: "User not found." });
    }
    req.user = userData;
    next(); // Proceed to the next middleware
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token.", error: error.message });
  }
}

module.exports = tokenMiddleware;
