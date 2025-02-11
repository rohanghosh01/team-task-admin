const MESSAGES = {
  SUCCESS: {
    USER_SIGNUP: {
      message: "Signup successful, please verify your email.",
      code: 201,
      type: "SUCCESS",
    },
    EMAIL_VERIFIED: {
      message: "Email verified successfully.",
      code: 200,
      type: "SUCCESS",
    },
    LOGIN_SUCCESS: {
      message: "Login successful.",
      code: 200,
      type: "SUCCESS",
    },
    OTP_SENT: {
      message: "OTP sent successfully.",
      code: 200,
      type: "SUCCESS",
    },
    PASSWORD_RESET: {
      message: "Password reset successfully.",
      code: 200,
      type: "SUCCESS",
    },
    MAGIC_LINK_SENT: {
      message: "Magic link sent successfully.",
      code: 200,
      type: "SUCCESS",
    },
  },
  ERROR: {
    EMAIl_EXISTS: {
      message: "Email already exists.",
      code: 409,
      type: "ERROR",
    },
    INVALID_CREDENTIALS: {
      message: "Invalid email or password.",
      code: 401,
      type: "ERROR",
    },
    USER_NOT_FOUND: {
      message: "User not found.",
      code: 404,
      type: "ERROR",
    },
    EMAIL_NOT_VERIFIED: {
      message: "Email is not verified. Please verify your email.",
      code: 403,
      type: "ERROR",
    },
    INVALID_OTP: {
      message: "Invalid or expired OTP.",
      code: 400,
      type: "ERROR",
    },
    RESET_LINK_EXPIRED: {
      message: "Reset link has expired.",
      code: 410,
      type: "ERROR",
    },
    TOKEN_INVALID: {
      message: "Invalid or expired token.",
      code: 403,
      type: "ERROR",
    },
    TOKEN_MISSING: {
      message: "Token is required.",
      code: 403,
      type: "ERROR",
    },
    USER_INACTIVE: {
      message: "User is inactive contact admin.",
      code: 403,
      type: "ERROR",
    },
    SERVER_ERROR: {
      message: "Internal server error.",
      code: 500,
      type: "ERROR",
    },
    UNAUTHORIZED: {
      message: "Unauthorized access.",
      code: 401,
      type: "ERROR",
    },
    VERIFY_EMAIL: {
      message:
        "Email not verified. A verification link has been sent to your email.",
      code: 200,
      type: "SUCCESS",
    },
  },
};

module.exports = MESSAGES;
