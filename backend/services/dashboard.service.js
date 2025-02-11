const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const Activity = require("../models/activity");
const mongoose = require("mongoose");
const dashboardService = {
  async getMemberCounts() {
    try {
      const active = await User.countDocuments({
        status: "active",
        deletedAt: null,
        role: "member",
      });
      const inactive = await User.countDocuments({
        status: "inactive",
        deletedAt: null,
        role: "member",
      });

      return { total: active + inactive, active, inactive };
    } catch (error) {
      console.error("Failed to get active member count", error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
      };
    }
  },
  async getProjectCounts() {
    try {
      const active = await Project.countDocuments({
        status: "active",
        deletedAt: null,
      });
      const total = await Project.countDocuments({
        deletedAt: null,
      });
      const completed = await Project.countDocuments({
        status: "completed",
        deletedAt: null,
      });

      return { total, active, completed };
    } catch (error) {
      console.error("Failed to get Project count", error);
      return {
        total: 0,
        active: 0,
        completed: 0,
      };
    }
  },
  async getTasksCounts() {
    try {
      const todo = await Task.countDocuments({
        status: "todo",
        deletedAt: null,
      });
      const progress = await Task.countDocuments({
        status: "in_progress",
        deletedAt: null,
      });
      const review = await Task.countDocuments({
        status: "in_review",
        deletedAt: null,
      });
      const done = await Task.countDocuments({
        status: "done",
        deletedAt: null,
      });

      return {
        total: todo + progress + review + done,
        todo,
        progress,
        review,
        done,
      };
    } catch (error) {
      console.error("Failed to get active member count", error);
      return {
        total: 0,
        todo: 0,
        progress: 0,
        review: 0,
        done: 0,
      };
    }
  },

  async topProjectsByProgress(limit = 5) {
    try {
      const result = await Project.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
          },
        },
        {
          $addFields: {
            totalTasks: { $size: "$tasks" },
            completedTasks: {
              $size: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: { $eq: ["$$task.status", "done"] },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1, // Include project name
            progress: {
              $cond: {
                if: { $gt: ["$totalTasks", 0] }, // If tasks exist
                then: {
                  $multiply: [
                    { $divide: ["$completedTasks", "$totalTasks"] },
                    100,
                  ],
                }, // Calculate %
                else: 0, // No tasks, progress is 0%
              },
            },
          },
        },
        { $sort: { progress: -1 } }, // Sort by progress descending
        { $limit: limit }, // Limit results
      ]);

      return result.length ? result : [];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async recentTask() {
    try {
      const result = await Task.aggregate([
        { $sort: { createdAt: -1 } }, // Sort tasks by creation date
        { $limit: 3 }, // Limit to the most recent task
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async recentMembers() {
    try {
      const result = await User.aggregate([
        { $match: { role: "member" } }, // Filter for members only
        { $sort: { createdAt: -1 } }, // Sort users by creation date
        { $limit: 3 }, // Limit to the most recent user
        { $project: { _id: 1, name: 1, role: 1, createdAt: 1 } }, // Only return necessary fields
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async recentActivity() {
    try {
      const result = await Activity.aggregate([
        { $sort: { createdAt: -1 } }, // Sort activities by creation date
        { $limit: 3 }, // Limit to the most recent activity
        {
          $project: {
            _id: 1,
            action: 1,
            previousValue: 1,
            newValue: 1,
            key: 1,
            message: 1,
            performedBy: 1,
            createdAt: 1,
          },
        },
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getChartData({ startDate, endDate, projectId, userId }) {
    try {
      const matchStage = {};

      if (startDate && endDate) {
        matchStage["tasks.createdAt"] = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      if (userId) {
        console.log(">>", userId);
        matchStage["tasks.assignee"] = userId;
      }
      if (projectId) {
        matchStage["_id"] = new mongoose.Types.ObjectId(projectId);
      }

      const aggregationPipeline = [
        {
          $match: projectId
            ? { _id: new mongoose.Types.ObjectId(projectId) }
            : {},
        },
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "projectId",
            as: "tasks",
          },
        },
        { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: true } },
        { $match: matchStage },
        {
          $group: {
            _id: projectId ? "$_id" : null,
            projectName: { $first: "$name" },
            totalProjects: { $sum: projectId ? 0 : 1 },
            totalTasks: {
              $sum: { $cond: [{ $ifNull: ["$tasks._id", false] }, 1, 0] },
            },
            completedTasks: {
              $sum: { $cond: [{ $eq: ["$tasks.status", "done"] }, 1, 0] },
            },
            taskByStatus: {
              $push: "$tasks.status",
            },
            taskByPriority: {
              $push: "$tasks.priority",
            },
            uniqueMembers: { $addToSet: "$tasks.assignee" },
          },
        },
        {
          $project: {
            projectName: 1,
            totalProjects: 1,
            totalTasks: 1,
            completedTasks: 1,
            pendingTasks: { $subtract: ["$totalTasks", "$completedTasks"] },
            progress: {
              $cond: {
                if: { $gt: ["$totalTasks", 0] },
                then: {
                  $multiply: [
                    { $divide: ["$completedTasks", "$totalTasks"] },
                    100,
                  ],
                },
                else: 0,
              },
            },
            taskByStatus: {
              $arrayToObject: {
                $map: {
                  input: ["todo", "in_progress", "in_review", "done"],
                  as: "status",
                  in: {
                    k: "$$status",
                    v: {
                      $size: {
                        $filter: {
                          input: "$taskByStatus",
                          as: "t",
                          cond: { $eq: ["$$t", "$$status"] },
                        },
                      },
                    },
                  },
                },
              },
            },
            taskByPriority: {
              $arrayToObject: {
                $map: {
                  input: ["low", "medium", "high", "urgent"],
                  as: "priority",
                  in: {
                    k: "$$priority",
                    v: {
                      $size: {
                        $filter: {
                          input: "$taskByPriority",
                          as: "p",
                          cond: { $eq: ["$$p", "$$priority"] },
                        },
                      },
                    },
                  },
                },
              },
            },
            totalMembers: { $size: "$uniqueMembers" },
          },
        },
      ];

      const result = await Project.aggregate(aggregationPipeline);

      return result.length ? result[0] : {};
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
module.exports = dashboardService;
