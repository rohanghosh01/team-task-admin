const Joi = require("joi");

const validationSchemas = {
  signup: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    dob: Joi.date().iso().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  resetPasswordRequest: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Passwords must match" }),
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("newPassword"))
      .required()
      .messages({ "any.only": "Passwords must match" }),
  }),

  addMember: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    // phoneNumber: Joi.string()
    //   .pattern(/^[0-9]{10}$/)
    //   .optional(),
    // dob: Joi.date().iso().optional(),
    // gender: Joi.string().valid("male", "female", "other").optional(),
  }),

  // Validation schema for creating a project
  createProject: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(4).max(500).required(),
    status: Joi.string()
      .valid("active", "completed", "hold", "archived")
      .required(),
    priority: Joi.string().valid("low", "medium", "high", "urgent").required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow("", null).optional(),
  }),
  // Validation schema for updating a project
  updateProject: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    status: Joi.string()
      .valid("active", "completed", "hold", "archived")
      .optional(),
    priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }),

  // Validation schema for adding a project member
  addMemberProject: Joi.object({
    members: Joi.array().required(),
    projectId: Joi.string().required(), // Assuming projectId will be a string (can be a mongoose ObjectId)
  }),

  // Validation schema for task input
  createTask: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(1).max(500).allow("", null).optional(),
    status: Joi.string()
      .valid("todo", "in_progress", "in_review", "done")
      .required(),
    priority: Joi.string().valid("low", "medium", "high", "urgent").required(),
    projectId: Joi.string().required(),
    assignee: Joi.string().optional(), // Assuming assignee is a userId
    labels: Joi.array().optional(), // Assuming assignee is a userId
  }),
};

module.exports = validationSchemas;
