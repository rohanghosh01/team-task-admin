const express = require("express");
const router = express.Router();
const tokenMiddleware = require("../middlewares/tokenMiddlewares");
const validate = require("../middlewares/validate");
const adminTokenMiddleware = require("../middlewares/adminTokenMiddlewares");
const validationSchemas = require("../validations");
const {
  getUser,
  addMember,
  decryptPassword,
  memberList,
  addBulkMembers,
  removeMember,
  updateMember,
  updateProfile,
} = require("../controllers/userController");

router.get("/profile", tokenMiddleware, getUser);
router.patch("/profile", tokenMiddleware, updateProfile);
router.post(
  "/add-member",
  adminTokenMiddleware,
  validate(validationSchemas.addMember),
  addMember
);
router.post("/add-member-bulk", adminTokenMiddleware, addBulkMembers);
router.get("/show-password/:id", adminTokenMiddleware, decryptPassword);
router.get("/members", adminTokenMiddleware, memberList);
router.delete("/members", adminTokenMiddleware, removeMember);
router.patch("/members/:id", adminTokenMiddleware, updateMember);

module.exports = router;
