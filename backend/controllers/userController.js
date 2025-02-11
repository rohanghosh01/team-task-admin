const bcrypt = require("bcrypt");
const userService = require("../services/user.service");
const { encrypt, decrypt } = require("../utils/cryptoUtil");
const generatePassword = require("../utils/generatePassword");
const userController = {
  async getUser(req, res) {
    const { id } = req.user;
    try {
      const user = await userService.getProfile(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("getUser controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async addMember(req, res) {
    const body = req.body;
    try {
      const user = await userService.findUserByEmail(body.email);
      if (user) {
        return res.status(404).json({ message: "email already exist" });
      }
      const password = generatePassword();

      const passwordHash = await bcrypt.hash(password, 10);
      const encryptedPassword = encrypt(password);
      const insertData = {
        ...body,
        passwordHash,
        encryptedPassword,
      };

      const result = await userService.createUser(insertData);
      return res.status(201).json(result);
    } catch (error) {
      console.error("getUser controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async addBulkMembers(req, res) {
    const body = req.body; // The array of users sent from the frontend
    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ message: "Invalid or empty user data" });
    }

    try {
      // Step 1: Prepare the users to insert
      const insertData = [];
      for (const user of body) {
        const { name, email, role = "member" } = user;

        // Step 2: Check if the user already exists
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
          console.log(`User with email ${email} already exists. Skipping.`);
          continue; // Skip if the user already exists
        }

        // Step 3: Generate password and hash it
        const password = generatePassword();
        const passwordHash = await bcrypt.hash(password, 10);
        const encryptedPassword = encrypt(password);

        // Add user data to the insert list
        insertData.push({
          name,
          email,
          role,
          passwordHash,
          encryptedPassword,
        });
      }

      if (insertData.length > 0) {
        // Step 4: Insert the valid users into the database
        const result = await userService.createUsers(insertData);
        return res.status(201).json({
          message: `${result.length} users added successfully`,
          result,
        });
      } else {
        return res.status(400).json({ message: "No new users to add" });
      }
    } catch (error) {
      console.error("Bulk user upload failed", error);
      return res
        .status(500)
        .json({ message: "Server error while processing the bulk upload" });
    }
  },
  async memberList(req, res) {
    let {
      limit = 10,
      offset = 0,
      search,
      status = "all",
      role = "all",
    } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    try {
      const { users, totalCount } = await userService.getAllUsers({
        limit,
        offset,
        search: search ? search.trim() : "",
        status,
        role,
      });
      if (!users.length) {
        return res.status(404).json({ message: "members not found" });
      }
      const nextOffset = offset + limit < totalCount ? offset + limit : null;
      return res.json({ nextOffset, totalCount, users });
    } catch (error) {
      console.error("getUser controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async decryptPassword(req, res) {
    const id = req.params.id;
    try {
      const user = await userService.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const decryptedPassword = decrypt(user.encryptedPassword);

      return res.json({ decryptedPassword });
    } catch (error) {
      console.error("getUser controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async removeMember(req, res) {
    let { ids } = req.query;
    ids = ids.split(",");
    try {
      const result = await userService.bulkDeleteUser(ids);

      return res.json({ message: "success" });
    } catch (error) {
      console.error("removeMember controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateMember(req, res) {
    const body = req.body;
    const id = req.params.id;
    try {
      const user = await userService.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "member not exist" });
      }

      const result = await userService.updateUser(id, body);
      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.error("getUser controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async memberCsvDownload(req, res) {
    let { ids } = req.query;
    ids = ids.split(",");
    try {
      const result = await userService.bulkDeleteUser(ids);

      return res.json({ message: "success" });
    } catch (error) {
      console.error("removeMember controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async updateProfile(req, res) {
    const user = req.user;
    const { name = null, password = null, confirmPassword = null } = req.body;

    let data = {
      name: name || user.name,
    };

    if (password) {
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Password and Confirm Password do not match" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      data.passwordHash = passwordHash;
      data.encryptedPassword = encrypt(password);
    }

    try {
      const updatedUser = await userService.updateUser(user._id, data);

      return res.json(updatedUser);
    } catch (error) {
      console.error("updateProfile controller failed", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;
