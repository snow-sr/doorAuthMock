const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
// const { generateToken } = require("./");
// const validateEmail = require("../../../../helpers/validate/fields");

const prisma = new PrismaClient();

async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found"); // Agora lança um erro quando o usuário não é encontrado
    }
    delete user.password;
    return { user };
  } catch (error) {
    return { error: error.message }; // Retorna a mensagem de erro
  }
}


async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      throw new Error("No users found");
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
      throw new Error("User not found");
    }
    return { user };
  } catch (error) {
    return new Error("Error deleting user");
  }
}

async function updateUser(userId, data) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: data,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return { user };
  } catch (error) {
    return new Error("Error updating user");
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};