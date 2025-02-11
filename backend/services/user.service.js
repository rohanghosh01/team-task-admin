const mongoose = require("mongoose");
const User = require("../models/user");
const { ADMIN_EMAIL } = process.env;
const userService = {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  },
  async createUsers(userData) {
    try {
      // Insert multiple users in bulk
      const result = await User.insertMany(userData);
      return result;
    } catch (error) {
      console.error("Bulk user creation failed", error);
      throw new Error("Failed to create users");
    }
  },

  async findUserByEmail(email) {
    return await User.findOne({ email, status: "active", deletedAt: null });
  },
  async findUserData(email) {
    return await User.findOne({ email, deletedAt: null });
  },
  async getProfile(id) {
    return await User.findOne(
      { _id: id, status: "active", deletedAt: null },
      {
        passwordHash: 0, // Hide the password field
        verificationTokenExpires: 0,
        verificationToken: 0,
      }
    );
  },

  async updateUser(id, updateData) {
    return await User.updateOne(
      {
        _id: id,
      },
      updateData
    );
  },

  async findUserById(id) {
    if (id == "N/A") return null;
    try {
      return await User.findById(id);
    } catch (error) {
      console.error("Failed to find user by ID", error);
      throw new Error("Failed to find user by ID");
    }
  },

  async findUserByVerificationToken(token) {
    return await User.findOne({
      verificationToken: token,
      status: "active",
      deletedAt: null,
    });
  },

  async getAllUsers(where) {
    const { limit = 10, offset = 0, search, status, role } = where;
    const whereParams = {
      email: { $ne: ADMIN_EMAIL },
      deletedAt: null,
    };

    if (status !== "all") whereParams.status = status;
    if (role !== "all") whereParams.role = role;

    // Only apply the search filter if it's not empty or undefined
    const match = search
      ? {
          $and: [
            {
              $or: [
                { name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
                { email: { $regex: search, $options: "i" } }, // Case-insensitive search on email
              ],
            },
            { email: { $ne: ADMIN_EMAIL } }, // Exclude users with the admin email
          ],
        }
      : whereParams; // Exclude users with the admin email if no search term

    const pipeline = [
      {
        $facet: {
          users: [
            { $match: match }, // Apply the search filter and exclude the admin email
            { $sort: { createdAt: -1 } },
            { $skip: offset }, // Skip the number of records based on offset
            { $limit: limit }, // Limit the number of records based on the limit
          ],
          totalCount: [
            { $match: match }, // Apply the same filter to count the total records
            { $count: "total" }, // Count the total matching records
          ],
        },
      },
    ];

    const result = await User.aggregate(pipeline);

    // Extract the total count and the users from the result
    const users = result[0]?.users || [];
    const totalCount = result[0]?.totalCount?.[0]?.total || 0;

    return {
      users,
      totalCount,
    };
  },

  async bulkDeleteUser(ids) {
    return await User.bulkWrite(
      [
        {
          updateMany: {
            filter: { _id: { $in: ids } }, // Filter to match user IDs
            update: { $set: { deletedAt: new Date(), status: "inactive" } }, // Fields to update
          },
        },
      ],
      { ordered: false } // Optional: Allows operations to continue if one fails
    );
  },
};

module.exports = userService;
