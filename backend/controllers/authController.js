const bcrypt = require("bcrypt");
const userService = require("../services/user.service");
const { ERROR } = require("../utils/constants");
const jwtUtil = require("../utils/jwtUtil");

const authController = {
  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.findUserData(email);

      if (!user) return res.status(400).json(ERROR.INVALID_CREDENTIALS);

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid)
        return res.status(400).json(ERROR.INVALID_CREDENTIALS);

      if (user.status === "inactive") {
        return res.status(401).json(ERROR.USER_INACTIVE);
      }

      const payload = { id: user._id, email: user.email, role: user.role };
      const token = jwtUtil.generateToken(
        {
          ...payload,
          type: "token",
        },
        "token"
      );

      const refreshToken = jwtUtil.generateToken(
        {
          ...payload,
          type: "refresh",
        },
        "refresh"
      );

      const { passwordHash, ...userData } = user._doc;

      const cookieOptions = {
        path: "/",
        domain: "localhost",
      };

      res.json({ token, refreshToken, user: userData });
    } catch (error) {
      console.error("login controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },

  async refreshToken(req, res) {
    const user = req.user;
    try {
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        type: "token",
      };
      const token = jwtUtil.generateToken(payload, "token");
      res.json({ token });
    } catch (error) {
      console.error("refreshToken controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
};

module.exports = authController;
