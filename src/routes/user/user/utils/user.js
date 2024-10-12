const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
// const { generateToken } = require("./");
// const validateEmail = require("../../../../helpers/validate/fields");

const prisma = new PrismaClient();

async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new Error("User not found");
    }
    console.log(user, ' saidgaufgvdyfgvuadfgvausyidgfvuAKDGUAYsdguAYDFGYTUWEFYUIWCGWUFYWUIFGWUIOFDGWUIFDGWUIYDFGWUEYIDFGUWIEEFDGUIASFGYUWFWYUEFGVUAWESFTASDUHGFHJAWGEHJDYGWEFUWTYFGDYUWSTFGHWTEFYHWTFWEYWGFV')
    delete user.password;
    return { user };
  } catch (error) {
    return new Error("Error getting user");
  }
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return new Error("No users found");
    }
    users.forEach((user) => {
      delete user.password;
    });
    return { users };
  } catch (error) {
    return new Error("Error getting users");
  }
}

async function deleteUser(userId) {
  try {
    const user = await prisma.user.delete({ where: { id: userId } });
    if (!user) {
      return new Error("User not found");
    }
    return { user };
  } catch (error) {
    return new Error("Error deleting user");
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
};