const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const tokenMiddleware = require("../middlewares/tokenMiddlewares");
const validate = require("../middlewares/validate");
const adminTokenMiddleware = require("../middlewares/adminTokenMiddlewares");
const validationSchemas = require("../validations");

router.post(
  "/",
  validate(validationSchemas.createProject),
  adminTokenMiddleware,
  projectController.createProject
); // Create project
router.get("/", tokenMiddleware, projectController.getAllProjects); // Get all projects
router.get("/:id", tokenMiddleware, projectController.getProjectById); // Get project by ID
router.put("/:id", adminTokenMiddleware, projectController.updateProject); // Update project
router.delete("/:id", adminTokenMiddleware, projectController.deleteProject); // Delete project
router.post(
  "/members/",
  validate(validationSchemas.addMemberProject),
  projectController.addMembers
);
router.get("/members/list/", projectController.getAllMembers);

// Add a task to a project
router.post(
  "/tasks",
  tokenMiddleware,
  validate(validationSchemas.createTask),
  projectController.addTask
);
router.get("/:id/tasks/", tokenMiddleware, projectController.getAllTasks); // Get all tasks
router.put("/:id/tasks/", tokenMiddleware, projectController.updateTask); // Get all tasks
router.get("/tasks/:id", tokenMiddleware, projectController.taskDetails); // Get all tasks
router.get("/labels/list", tokenMiddleware, projectController.getLabelList); // Get all tasks
router.get(
  "/activity/:id",
  tokenMiddleware,
  projectController.getActivityLList
); // Get all activity
router.get("/comments/:id", tokenMiddleware, projectController.getCommentList);
router.put("/comments/:id", tokenMiddleware, projectController.updateComment);
router.delete(
  "/comments/:id",
  tokenMiddleware,
  projectController.deleteComment
);
router.post("/comments/add", tokenMiddleware, projectController.addComment);
router.post(
  "/comments/reaction/",
  tokenMiddleware,
  projectController.addReaction
);

router.get(
  "/comments/reaction/:id",
  tokenMiddleware,
  projectController.getReactionList
);
module.exports = router;
