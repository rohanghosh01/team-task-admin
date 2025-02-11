const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoute");
const userRoutes = require("./userRoute");
const dashboardRoutes = require("./dashboardRoute");
const projectRoutes = require("./projectRoute"); // Add project route here

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
