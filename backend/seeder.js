require("dotenv").config();
const bcrypt = require("bcrypt");
const userService = require("./services/user.service");
const connectDB = require("./config/db");
const { encrypt } = require("./utils/cryptoUtil");

const {
  ADMIN_NAME = "Admin",
  ADMIN_PASSWORD = "admin@123",
  ADMIN_EMAIL = "admin@teamtask.com",
} = process.env;
const adminCredentials = {
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: "admin",
};

async function createAdmin() {
  connectDB();
  try {
    const getAdmin = await userService.findUserByEmail(adminCredentials.email);
    if (getAdmin) {
      console.log("Admin user already exists.");
      process.exit();
    }
    const passwordHash = await bcrypt.hash(adminCredentials.password, 10);
    adminCredentials.passwordHash = passwordHash;
    adminCredentials.encryptedPassword = encrypt(adminCredentials.password);
    const result = await userService.createUser(adminCredentials);
    console.log(`Admin user created: ${result}`);
    process.exit();
  } catch (error) {
    console.error("Error creating admin user", error);
    process.exit();
  }
}

createAdmin();
