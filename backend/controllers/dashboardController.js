const dashboardService = require("../services/dashboard.service");
const { ERROR, SUCCESS } = require("../utils/constants");

const dashboardController = {
  // User login
  async overview(req, res) {
    try {
      const members = await dashboardService.getMemberCounts();
      const projects = await dashboardService.getProjectCounts();
      const tasks = await dashboardService.getTasksCounts();

      res.json({ members, projects, tasks });
    } catch (error) {
      console.error("overview controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
  async projectOverview(req, res) {
    try {
      const projects = await dashboardService.topProjectsByProgress();

      res.json(projects);
    } catch (error) {
      console.error("projectOverview controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
  async recentTasks(req, res) {
    try {
      const tasks = await dashboardService.recentTask();

      res.json(tasks);
    } catch (error) {
      console.error("recentTask controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
  async recentMembers(req, res) {
    try {
      const result = await dashboardService.recentMembers();

      res.json(result);
    } catch (error) {
      console.error("recentMembers controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
  async recentActivity(req, res) {
    try {
      // Implement logic to fetch recent activity logs
      const recentActivity = await dashboardService.recentActivity();

      res.json(recentActivity);
    } catch (error) {
      console.error("recentActivity controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
  async getChartData(req, res) {
    try {
      const { startDate = null, endDate = null, projectId = null } = req.query;
      let userId = null;

      if (req.user.role !== "admin") {
        userId = req.user._id;
      }
      const chartData = await dashboardService.getChartData({
        startDate,
        endDate,
        projectId,
        userId,
      });

      res.json(chartData);
    } catch (error) {
      console.error("getChartData controller failed", error);
      res.status(ERROR.SERVER_ERROR.code).json(ERROR.SERVER_ERROR);
    }
  },
};

module.exports = dashboardController;
