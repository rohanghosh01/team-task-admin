const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const validationSchemas = require("../validations");
const adminTokenMiddleware = require("../middlewares/adminTokenMiddlewares");
const tokenMiddleware = require("../middlewares/tokenMiddlewares");
const {
  overview,
  projectOverview,
  recentTasks,
  recentMembers,
  recentActivity,
  getChartData,
} = require("../controllers/dashboardController");
router.get("/overview", adminTokenMiddleware, overview);
router.get("/overview/project", adminTokenMiddleware, projectOverview);
router.get("/overview/task", adminTokenMiddleware, recentTasks);
router.get("/overview/member", adminTokenMiddleware, recentMembers);
router.get("/overview/activity", adminTokenMiddleware, recentActivity);
router.get("/overview/chart", tokenMiddleware, getChartData);

module.exports = router;
