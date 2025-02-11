const projectService = require("../services/project.service");
const userService = require("../services/user.service");

const projectController = {
  // Create a new project
  async createProject(req, res) {
    try {
      const projectData = req.body;

      const getProject = await projectService.getProjectByName(
        projectData.name
      );

      if (getProject) {
        return res.status(409).json({ message: "Project already exists" });
      }
      const project = await projectService.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all projects
  async getAllProjects(req, res) {
    let {
      limit = 10,
      offset = 0,
      search,
      status = "all",
      priority = "all",
    } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    try {
      const userId = getUserId(req);

      const params = {
        limit,
        offset,
        search: search ? search.trim() : "",
        status,
        priority,
        userId,
      };

      const service = userId ? "listUser" : "list";

      const { projects, totalCount } = await projectService[service](params);
      if (!projects.length) {
        return res.status(404).json({ message: "projects not found" });
      }
      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, projects: projects });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single project by ID
  async getProjectById(req, res) {
    const { id } = req.params;
    try {
      const project = await projectService.getProjectById(id);
      res.status(200).json(project);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Update a project by ID
  async updateProject(req, res) {
    const { id } = req.params;
    const projectData = req.body;
    try {
      const updatedProject = await projectService.updateProject(
        id,
        projectData
      );
      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a project by ID
  async deleteProject(req, res) {
    const { id } = req.params;
    try {
      const deletedProject = await projectService.deleteProject(id);
      res
        .status(200)
        .json({ message: "Project deleted successfully", deletedProject });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a member to the project
  async addMembers(req, res) {
    const { members, projectId } = req.body;
    try {
      const getProject = await projectService.getProjectByName(
        decodeURI(projectId)
      );

      if (!getProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      const memberData = members.map((member) => ({
        userId: member,
        projectId: getProject?._id,
      }));
      const updatedProject = await projectService.addMembersToProject(
        memberData
      );
      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Add a task to the project
  async addTask(req, res) {
    try {
      const { _id: userId, name: performedBy } = req.user;
      const getProject = await projectService.getProjectByName(
        decodeURI(req.body.projectId)
      );

      if (!getProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      // Call the service layer to add a task to the project
      const result = await projectService.addTaskToProject({
        ...req.body,
        projectId: getProject?._id,
      });

      await projectService.insertActivity({
        userId,
        action: "created",
        performedBy,
        taskId: result._id,
        message: `${performedBy} created the task`,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all projects
  async getAllTasks(req, res) {
    let {
      limit = 10,
      offset = 0,
      search,
      status = "all",
      priority = "all",
    } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const projectId = req.params.id;

    try {
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" }); // If projectId is not provided, return error message.
      }
      const getProject = await projectService.getProjectByName(
        decodeURI(projectId)
      );

      if (!getProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      const { tasks, totalCount } = await projectService.taskList({
        limit,
        offset,
        search: search ? search.trim() : "",
        status,
        priority,
        projectId: getProject?._id,
      });
      if (!tasks.length) {
        return res.status(404).json({ message: "tasks not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, tasks: tasks, type: status });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Update a project by ID
  async updateTask(req, res) {
    const { id } = req.params;
    const data = req.body;
    const { _id: userId, name: performedBy } = req.user;
    try {
      const getTask = await projectService.taskDetails(id);

      if (!getTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const result = await projectService.updateTask(id, data);

      if (req.body) {
        const key = Object.keys(req.body)[0];
        let previousValue = getTask[key] || "N/A";
        let newValue = req.body[key] || "N/A";

        if (key === "assignee") {
          let id = req.body.assignee;
          let getNewAssignee = await userService.findUserById(id);
          let getPrevAssignee = await userService.findUserById(previousValue);
          previousValue = getPrevAssignee?.name || "N/A";
          newValue = getNewAssignee.name || "N/A";
        }

        if (key === "labels") {
          previousValue = previousValue.join(",") || "N/A";
          newValue = newValue.join(",") || "N/A";
        }
        await projectService.insertActivity({
          key,
          userId,
          action: "updated",
          performedBy,
          taskId: id,
          previousValue,
          newValue,
          message: `${performedBy} updated the task`,
        });
      }

      res.status(200).json(result);
    } catch (error) {
      console.log(">>error update task", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get all projects
  async getAllMembers(req, res) {
    let { limit = 10, offset = 0, search, projectId } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    try {
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" }); // If projectId is not provided, return error message.
      }
      const getProject = await projectService.getProjectByName(
        decodeURI(projectId)
      );

      if (!getProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      const { results, totalCount } = await projectService.memberList({
        limit,
        offset,
        search: search ? search.trim() : "",
        projectId: getProject?._id,
      });
      if (!results.length) {
        return res.status(404).json({ message: "members not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, results });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },
  // Get all label
  async getLabelList(req, res) {
    let { limit = 10, offset = 0, search } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    try {
      const { results, totalCount } = await projectService.labelList({
        limit,
        offset,
        search: search ? search.trim() : "",
      });
      if (!results.length) {
        return res.status(404).json({ message: "members not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, results });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },

  async taskDetails(req, res) {
    const { id } = req.params;
    try {
      const result = await projectService.taskDetails(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all activity
  async getActivityLList(req, res) {
    let { limit = 10, offset = 0 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const id = req.params.id;

    try {
      const { results, totalCount } = await projectService.activityList({
        limit,
        offset,
        id,
      });
      if (!results.length) {
        return res.status(404).json({ message: "activity not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, results });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },

  // add comment
  async addComment(req, res) {
    const { comment, taskId } = req.body;
    const { _id: userId } = req.user;
    try {
      const getTask = await projectService.taskDetails(taskId);

      if (!getTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const result = await projectService.addCommentToTask({
        comment,
        userId: userId,
        taskId: getTask._id,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all comments
  async getCommentList(req, res) {
    let { limit = 10, offset = 0 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const id = req.params.id;

    try {
      const { results, totalCount } = await projectService.commentList({
        limit,
        offset,
        id,
      });
      if (!results.length) {
        return res.status(404).json({ message: "comments not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, results });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },
  async updateComment(req, res) {
    const { id } = req.params;
    const { comment } = req.body;
    const { _id: userId } = req.user;
    try {
      const result = await projectService.updateComment(id, {
        comment,
        isEdited: true,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async deleteComment(req, res) {
    const { id } = req.params;
    try {
      const result = await projectService.deleteComment(id);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // add reaction
  async addReaction(req, res) {
    const { reaction, commentId } = req.body;
    const { _id: userId } = req.user;
    const where = { commentId, userId };
    try {
      const getData = await projectService.getReaction(where);
      let action = "added";
      if (getData) {
        if (getData.reaction === reaction) {
          await projectService.deleteReaction(where);
          action = "deleted";
        } else {
          await projectService.updateReaction(getData._id, { reaction });
          action = "updated";
        }
      } else {
        await projectService.addReaction({ reaction, ...where });
      }

      res.status(200).json({ message: "success", action });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all reactions
  async getReactionList(req, res) {
    let { limit = 10, offset = 0 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const id = req.params.id;

    try {
      const { results, totalCount } = await projectService.reactionList({
        limit,
        offset,
        id,
      });
      if (!results.length) {
        return res.status(404).json({ message: "reactionList not found" });
      }

      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, results });
    } catch (error) {
      console.log(">>", error);
      res.status(500).json({ message: error.message });
    }
  },
};

function getUserId(req) {
  const { user } = req;
  let userId = null;
  if (user.role !== "admin") {
    userId = user._id;
  }
  return userId;
}

module.exports = projectController;
