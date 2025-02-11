const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const validationSchemas = require("../validations");
const refreshTokenMiddleware = require("../middlewares/refreshTokenMiddlewares");
const { login, refreshToken } = require("../controllers/authController");
router.post("/login", validate(validationSchemas.login), login);
router.post("/refresh-token", refreshTokenMiddleware, refreshToken);

module.exports = router;
