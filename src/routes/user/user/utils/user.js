const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { dateFormat } = require("../../../../helpers/date/date");

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Centralized function to disconnect Prisma
async function disconnectPrisma() {
  await prisma.$disconnect();
}

async function getUserById(userId) {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.created_at = dateFormat(user.created_at);
    user.updated_at = dateFormat(user.updated_at);
    delete user.password;
    return { user };
  } catch (error) {
    throw new Error(`Failed to get user by ID: ${error.message}`);
  } finally {
    await disconnectPrisma();
  }
}

async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    if (!users.length) {
      throw new NotFoundError("No users found");
    }
    users.forEach((user) => {
      user.created_at = dateFormat(user.created_at);
      user.updated_at = dateFormat(user.updated_at);
      delete user.password;
    });
    return { users };
  } catch (error) {
    throw new Error(`Failed to get all users: ${error.message}`);
  } finally {
    await disconnectPrisma();
  }
}

async function deleteUser(userId) {
  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  try {
    const userExist = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExist) {
      throw new NotFoundError("User not found");
    }
    const user = await prisma.user.delete({ where: { id: userId } });
    return { user };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  } finally {
    await disconnectPrisma();
  }
}

async function updateUser(userId, data) {
  console.log(userId + " IID CADASDAKSMDASKDMASLDALSDMLASM");
  // if (!userId) {
  //   throw new ValidationError("User ID is required" + userId);
  // }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: data,
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return { user };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  } finally {
    await disconnectPrisma();
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};
