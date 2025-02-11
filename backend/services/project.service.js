const Project = require("../models/project");
const ProjectMember = require("../models/projectMember");
const Task = require("../models/task");
const mongoose = require("mongoose");
const Label = require("../models/label");
const Activity = require("../models/activity");
const Comment = require("../models/comment");
const CommentReaction = require("../models/commentReaction");

const projectService = {
  // Create a new project
  async createProject(data) {
    try {
      const project = new Project(data);
      await project.save();
      return project;
    } catch (error) {
      throw new Error("Error creating project: " + error.message);
    }
  },

  // Get a list of all projects
  async list(where) {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        status,
        priority,
        userId,
      } = where;
      const whereParams = {
        deletedAt: null,
      };

      if (status !== "all") whereParams.status = status;
      if (priority !== "all") whereParams.priority = priority;

      // Only apply the search filter if it's not empty or undefined
      const match = search
        ? {
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
                  // { description: { $regex: search, $options: "i" } }, // Case-insensitive search on description
                ],
              },
            ],
          }
        : whereParams; // Exclude users with the admin email if no search term

      const pipeline = [
        {
          $facet: {
            projects: [
              { $match: match }, // Apply the search filter and exclude the admin email
              { $sort: { createdAt: -1 } },
              { $skip: offset }, // Skip the number of records based on offset
              { $limit: limit }, // Limit the number of records based on the limit
              {
                $lookup: {
                  from: "tasks", // Join with the tasks collection
                  localField: "_id", // The field in Project that references Task
                  foreignField: "projectId", // The field in Task that references Project
                  as: "tasks", // Alias for the joined tasks
                },
              },
              {
                $addFields: {
                  tasksCount: {
                    total: { $size: "$tasks" }, // Count all tasks
                    completed: {
                      $size: {
                        $filter: {
                          input: "$tasks", // Filter tasks based on status
                          as: "task",
                          cond: { $eq: ["$$task.status", "done"] },
                        },
                      },
                    },
                  },
                  progress: {
                    $cond: {
                      if: { $gt: [{ $size: "$tasks" }, 0] }, // Check if there are tasks
                      then: {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $size: {
                                  $filter: {
                                    input: "$tasks",
                                    as: "task",
                                    cond: { $eq: ["$$task.status", "done"] },
                                  },
                                },
                              },
                              { $size: "$tasks" },
                            ],
                          },
                          100,
                        ],
                      },
                      else: 0, // No tasks means 0% progress
                    },
                  },
                },
              },
            ],
            totalCount: [
              { $match: match }, // Apply the same filter to count the total records
              { $count: "total" }, // Count the total matching records
            ],
          },
        },
      ];

      const [{ projects = [], totalCount }] = await Project.aggregate(pipeline);
      console.log("totalCount>", totalCount);

      return {
        projects,
        totalCount: totalCount?.[0]?.total || 0,
      };
    } catch (error) {
      throw new Error("Error fetching projects: " + error.message);
    }
  },

  // Get a list of all projects for users
  async listUser(where) {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        status,
        priority,
        userId,
      } = where;
      const whereParams = {
        deletedAt: null,
      };

      if (status !== "all") whereParams.status = status;
      if (priority !== "all") whereParams.priority = priority;

      // Only apply the search filter if it's not empty or undefined
      const match = search
        ? {
            $and: [
              {
                $or: [
                  { name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
                  // { description: { $regex: search, $options: "i" } }, // Case-insensitive search on description
                ],
              },
            ],
          }
        : whereParams; // Exclude users with the admin email if no search term

      const pipeline = [
        {
          $facet: {
            projects: [
              { $match: match }, // Apply the search filter and exclude the admin email
              { $sort: { createdAt: -1 } },
              { $skip: offset }, // Skip the number of records based on offset
              { $limit: limit }, // Limit the number of records based on the limit
              {
                $lookup: {
                  from: "tasks", // Join with the tasks collection
                  localField: "_id", // The field in Project that references Task
                  foreignField: "projectId", // The field in Task that references Project
                  as: "tasks", // Alias for the joined tasks
                },
              },
              {
                $lookup: {
                  from: "projectmembers", // Join with the ProjectMember collection
                  localField: "_id", // The field in Project that references ProjectMember
                  foreignField: "projectId", // The field in ProjectMember that references Project
                  as: "members", // Alias for the joined project members
                  pipeline: [
                    {
                      $match: {
                        userId: userId,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  tasksCount: {
                    total: { $size: "$tasks" }, // Count all tasks
                    completed: {
                      $size: {
                        $filter: {
                          input: "$tasks", // Filter tasks based on status
                          as: "task",
                          cond: { $eq: ["$$task.status", "done"] },
                        },
                      },
                    },
                  },
                  progress: {
                    $cond: {
                      if: { $gt: [{ $size: "$tasks" }, 0] }, // Check if there are tasks
                      then: {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $size: {
                                  $filter: {
                                    input: "$tasks",
                                    as: "task",
                                    cond: { $eq: ["$$task.status", "done"] },
                                  },
                                },
                              },
                              { $size: "$tasks" },
                            ],
                          },
                          100,
                        ],
                      },
                      else: 0, // No tasks means 0% progress
                    },
                  },
                  // Check if the user is a member of the project
                  isUserMember: { $ne: [{ $size: "$members" }, 0] },
                },
              },
              {
                // Filter projects where the user is a member
                $match: { isUserMember: true },
              },
            ],
            totalCount: [
              { $match: match }, // Apply the same filter to count the total records
              {
                $lookup: {
                  from: "projectmembers",
                  localField: "_id",
                  foreignField: "projectId",
                  as: "members",
                  pipeline: [
                    {
                      $match: {
                        userId: userId,
                      },
                    },
                  ],
                },
              },
              {
                $match: {
                  $expr: { $ne: [{ $size: "$members" }, 0] }, // Match projects with members
                },
              },
              { $count: "total" }, // Count the total matching records
            ],
          },
        },
      ];

      const [{ projects = [], totalCount }] = await Project.aggregate(pipeline);

      return {
        projects,
        totalCount: totalCount?.[0]?.total || 0,
      };
    } catch (error) {
      console.log(">>", error);
      throw new Error("Error fetching projects: " + error.message);
    }
  },

  // Get a project by ID
  async getProjectById(id) {
    try {
      const project = await Project.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching project: " + error.message);
    }
  },
  // Get a project by ID
  async getProjectByName(name) {
    try {
      const project = await Project.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
      });
      return project;
    } catch (error) {
      throw new Error("Error fetching project: " + error.message);
    }
  },

  // Update a project by ID
  async updateProject(id, data) {
    try {
      const updatedProject = await Project.findByIdAndUpdate(id, data);
      if (!updatedProject) {
        throw new Error("Project not found");
      }
      return updatedProject;
    } catch (error) {
      throw new Error("Error updating project: " + error.message);
    }
  },

  // Delete a project by ID
  async deleteProject(id) {
    try {
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        throw new Error("Project not found");
      }
      return deletedProject;
    } catch (error) {
      throw new Error("Error deleting project: " + error.message);
    }
  },

  async addMembersToProject(data) {
    try {
      // Use insertMany with ordered: false to allow partial inserts
      const result = await ProjectMember.insertMany(data, { ordered: false });
      return result; // Successfully inserted documents
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error gracefully
        console.warn("Some members were not added due to duplicates.");
      } else {
        throw new Error(error.message);
      }
    }
  },

  async addTaskToProject(data) {
    try {
      // Create the new task

      const taskRef = new Task(data);
      await taskRef.save();
      return taskRef;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async taskList(where) {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        status,
        priority,
        projectId,
      } = where;
      const whereParams = {
        deletedAt: null,
        projectId,
      };

      if (status !== "all") whereParams.status = status;
      if (priority !== "all") whereParams.priority = priority;

      // Only apply the search filter if it's not empty or undefined
      const match = search
        ? {
            $and: [
              {
                $or: [
                  { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
                  // { description: { $regex: search, $options: "i" } }, // Case-insensitive search on description
                ],
              },
            ],
            ...whereParams,
          }
        : whereParams; // Exclude users with the admin email if no search term

      const pipeline = [
        {
          $facet: {
            tasks: [
              { $match: match }, // Apply the search filter
              { $sort: { createdAt: -1 } },
              { $skip: offset }, // Skip the number of records based on offset
              { $limit: limit }, // Limit the number of records based on the limit
              {
                $lookup: {
                  from: "users", // The name of the collection for users
                  localField: "assignee", // Field from the Task model
                  foreignField: "_id", // Field from the User model
                  as: "assignee", // Alias for the assignee data
                },
              },
              {
                $unwind: {
                  path: "$assignee", // Unwind the array returned by $lookup
                  preserveNullAndEmptyArrays: true, // Keep tasks with no assignee
                },
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  status: 1,
                  priority: 1,
                  startDate: 1,
                  endDate: 1,
                  projectId: 1,
                  labels: 1,
                  assignee: {
                    _id: 1,
                    name: 1,
                    email: 1,
                  },
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            ],
            totalCount: [
              { $match: match }, // Apply the same filter to count the total records
              { $count: "total" }, // Count the total matching records
            ],
          },
        },
      ];

      const [{ tasks = [], totalCount }] = await Task.aggregate(pipeline);
      console.log("totalCount>", totalCount);

      return {
        tasks,
        totalCount: totalCount?.[0]?.total || 0,
      };
    } catch (error) {
      console.log(">>", error);
      throw new Error("Error fetching tasks: " + error.message);
    }
  },

  async taskListGrouped(where) {
    try {
      const { limit = 10, offset = 0, search, priority, projectId } = where;

      const statuses = ["todo", "inProgress", "inReview", "done"]; // List of statuses to group by
      const whereParams = {
        deletedAt: null,
        projectId,
      };

      if (priority !== "all") whereParams.priority = priority;

      const match = search
        ? {
            $and: [
              {
                $or: [{ title: { $regex: search, $options: "i" } }],
              },
            ],
            ...whereParams,
          }
        : whereParams;

      const pipeline = [
        {
          $facet: statuses.reduce((acc, status) => {
            acc[status] = [
              { $match: { ...match, status } }, // Filter by status
              { $sort: { createdAt: -1 } },
              { $skip: offset }, // Pagination offset
              { $limit: limit }, // Pagination limit
            ];
            acc[`${status}TotalCount`] = [
              { $match: { ...match, status } },
              { $count: "total" },
            ];
            return acc;
          }, {}),
        },
      ];

      const [result] = await Task.aggregate(pipeline);

      // Format the result to include counts and tasks for each status
      const groupedTasks = statuses.reduce((acc, status) => {
        const total = result[`${status}TotalCount`]?.[0]?.total || 0;
        const nextOffset = offset + limit < total ? offset + limit : null;
        acc[status] = {
          tasks: result[status] || [],
          totalCount: total,
          nextOffset,
        };
        return acc;
      }, {});

      return groupedTasks;
    } catch (error) {
      console.error(">>", error);
      throw new Error("Error fetching grouped tasks: " + error.message);
    }
  },
  // Update a task by ID
  async updateTask(id, data) {
    try {
      const updateData = await Task.updateOne(
        {
          _id: id,
        },
        data
      );
      if (!updateData) {
        throw new Error("Task not found");
      }
      return updateData;
    } catch (error) {
      console.log(">>error", error);
      throw new Error("Error updating Task: " + error.message);
    }
  },
  // Update a task by ID
  async countTasks() {
    try {
      const result = await Task.countDocuments({
        deletedAt: null,
      });

      return result;
    } catch (error) {
      throw new Error("Error countTasks Task: " + error.message);
    }
  },
  // Get a list of all task
  async memberList(where) {
    try {
      const { limit = 10, offset = 0, search, projectId } = where;

      // Base query conditions
      const matchConditions = {
        deletedAt: null,
        projectId: projectId,
      };

      // If a search term is provided, filter by user's name or email
      const resultsMatchConditions = {
        ...matchConditions,
        ...(search && {
          $or: [
            { "user.name": { $regex: search, $options: "i" } }, // Case-insensitive search on name
            { "user.email": { $regex: search, $options: "i" } }, // Case-insensitive search on email
          ],
        }),
      };

      const results = await ProjectMember.aggregate([
        { $match: matchConditions }, // Match project members (ignores the search here)
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" }, // Flatten the user array to get individual documents
        { $match: resultsMatchConditions }, // Apply the search filter on the user's name here
        {
          $project: {
            _id: 1,
            role: 1,
            joinedAt: 1,
            user: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        },
        { $skip: offset },
        { $limit: limit },
      ]);

      // Count the total number of matching project members (ignoring pagination)
      const countResults = await ProjectMember.aggregate([
        { $match: matchConditions }, // Match project members
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $match: resultsMatchConditions }, // Apply the search filter here as well
        { $count: "totalMembers" }, // Count the total number of members
      ]);

      const totalCount =
        countResults.length > 0 ? countResults[0].totalMembers : 0;

      // Return results along with count
      return { results, totalCount };
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error fetching project members: " + error.message);
    }
  },

  async taskDetails(id) {
    try {
      const task = await Task.findById(id).populate(
        "assignee",
        "name email _id"
      );

      if (!task) {
        throw new Error("Task not found");
      }

      return task;
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error fetching task details:" + error.message);
    }
  },

  async labelList(where) {
    try {
      const { limit = 10, offset = 0, search } = where;
      const results = await Label.find({
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .skip(offset)
        .limit(limit);

      const totalCount = await Label.countDocuments({
        ...(search && { name: { $regex: search, $options: "i" } }),
      });

      return { results, totalCount };
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error fetching labels:" + error.message);
    }
  },

  async tasksCount(projectId) {
    try {
      const total = await Task.countDocuments({
        deletedAt: null,
      });
      const done = await Task.countDocuments({
        status: "done",
        deletedAt: null,
      });

      return {
        total,
        done,
      };
    } catch (error) {
      console.error(">> Error:", error);

      return {
        total: 0,
        done: 0,
      };
    }
  },

  async insertActivity(data) {
    try {
      const result = new Activity(data);
      await result.save();
      return result;
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error inserting activity: " + error.message);
    }
  },

  async activityList(where) {
    try {
      const { limit = 10, offset = 0, id } = where;
      const results = await Activity.find({
        taskId: id,
      })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit);

      const totalCount = await Activity.countDocuments({
        taskId: id,
      });

      return { results, totalCount };
    } catch (error) {
      console.error(">> Error activityList:", error);
      throw new Error("Error fetching activityList:" + error.message);
    }
  },

  async addCommentToTask(data) {
    try {
      const result = new Comment(data);
      // Populate the userId field after saving
      await result.save();
      const populatedResult = await Comment.findById(result._id).populate(
        "userId",
        "name email _id"
      );

      return populatedResult;
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error inserting comment: " + error.message);
    }
  },

  // async commentList(where) {
  //   try {
  //     const { limit = 10, offset = 0, id } = where;
  //     const results = await Comment.find({
  //       taskId: id,
  //     })
  //       .sort({ updatedAt: -1 })
  //       .skip(offset)
  //       .limit(limit)
  //       .populate("userId", "name email _id");

  //     const totalCount = await Comment.countDocuments({
  //       taskId: id,
  //     });

  //     return { results, totalCount };
  //   } catch (error) {
  //     console.error(">> Error activityList:", error);
  //     throw new Error("Error fetching activityList:" + error.message);
  //   }
  // },

  async commentList(where) {
    try {
      const { limit = 10, offset = 0, id } = where;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid taskId provided");
      }

      const taskObjectId = new mongoose.Types.ObjectId(id);

      const results = await Comment.aggregate([
        { $match: { taskId: taskObjectId } }, // Match comments for the task
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" }, // Flatten the user array
        {
          $lookup: {
            from: "commentreactions",
            localField: "_id",
            foreignField: "commentId",
            as: "reactions",
          },
        },
        {
          $unwind: {
            path: "$reactions",
            preserveNullAndEmptyArrays: true, // Keep comments without reactions
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reactions.userId",
            foreignField: "_id",
            as: "reactionUser",
          },
        },
        {
          $unwind: { path: "$reactionUser", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$_id",
            comment: { $first: "$comment" },
            isEdited: { $first: "$isEdited" },
            performedBy: { $first: "$performedBy" },
            createdAt: { $first: "$createdAt" },
            user: { $first: "$user" },
            reactions: {
              $push: {
                _id: "$reactions._id",
                reaction: "$reactions.reaction",
                userId: "$reactionUser._id",
                name: "$reactionUser.name",
                email: "$reactionUser.email",
              },
            },
          },
        },
        {
          $addFields: {
            totalReactions: { $size: "$reactions" }, // Total number of reactions
            reactions: { $slice: ["$reactions", 10] }, // First 10 reactions
          },
        },
        {
          $project: {
            _id: 1,
            comment: 1,
            isEdited: 1,
            performedBy: 1,
            createdAt: 1,
            user: { _id: 1, name: 1, email: 1 },
            reactions: 1, // Include first 10 reactions with user info
            totalReactions: 1, // Total count of reactions
          },
        },
        { $sort: { createdAt: -1 } }, // Sort by creation time in descending order
        { $skip: offset }, // Skip for pagination
        { $limit: limit }, // Limit for pagination
      ]);

      const totalCount = await Comment.countDocuments({
        taskId: taskObjectId,
      });

      return { results, totalCount };
    } catch (error) {
      console.error(">> Error commentList:", error);
      throw new Error("Error fetching commentList: " + error.message);
    }
  },

  async updateComment(id, data) {
    try {
      return await Comment.updateOne(
        {
          _id: id,
        },
        data
      );
    } catch (error) {
      console.error(">> Error deleteComment:", error);
      throw new Error("Error updateComment: " + error.message);
    }
  },
  async deleteComment(id) {
    try {
      return await Comment.deleteOne({
        _id: id,
      });
    } catch (error) {
      console.error(">> Error deleteComment:", error);
      throw new Error("Error updateComment: " + error.message);
    }
  },

  async getReaction(where) {
    try {
      const result = await CommentReaction.findOne(where);

      return result;
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error getReaction details:" + error.message);
    }
  },

  async addReaction(data) {
    try {
      const result = new CommentReaction(data);
      // Populate the userId field after saving
      await result.save();
      const populatedResult = await CommentReaction.findById(
        result._id
      ).populate("userId", "name email _id");

      return populatedResult;
    } catch (error) {
      console.error(">> Error:", error);
      throw new Error("Error inserting comment: " + error.message);
    }
  },
  async updateReaction(id, data) {
    try {
      return await CommentReaction.findOneAndUpdate({ _id: id }, data);
    } catch (error) {
      console.error(">> Error updateReaction:", error);
      throw new Error("Error updateReaction: " + error.message);
    }
  },
  async deleteReaction(where) {
    try {
      return await CommentReaction.deleteOne(where);
    } catch (error) {
      console.error(">> Error deleteReaction:", error);
      throw new Error("Error deleteReaction: " + error.message);
    }
  },

  async reactionList(where) {
    try {
      const { limit = 10, offset = 0, id } = where;
      const results = await CommentReaction.find({
        commentId: id,
      })
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("userId", "name email _id");

      const totalCount = await Comment.countDocuments({
        taskId: id,
      });

      return { results, totalCount };
    } catch (error) {
      console.error(">> Error activityList:", error);
      throw new Error("Error fetching activityList:" + error.message);
    }
  },
};

module.exports = projectService;
