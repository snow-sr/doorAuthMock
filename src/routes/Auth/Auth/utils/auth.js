const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken, generatePasswordResetToken } = require("./token");
const validateEmail = require("../../../../helpers/validate/fields");
const { emailForgetPassword } = require("../../../../helpers/mail/mail");

const prisma = new PrismaClient();

// Custom Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

async function registerUser(email, password, name) {
  if (!email || !password || !name) {
    throw new ValidationError("All fields are required");
  }

  if (!validateEmail(email)) {
    throw new ValidationError("Invalid email format");
  }

  if (password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters long");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ValidationError("Email is already in use");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function loginUser(email, password) {
  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  if (!validateEmail(email)) {
    throw new ValidationError("Invalid email format");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthError("Incorrect password");
    }

    const token = generateToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { updated_at: new Date() },
    });
    return { token, user };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyUser(userData) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
    });
    if (!user) {
      throw new AuthError("User not found");
    }
    const isSuper = user.isSuper;
    const isVerify = user.isVerified;
    return { isSuper, isVerify };
  } catch (error) {
    throw new Error(`Verification failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function forgetPassword(email) {
  if (!email) {
    throw new ValidationError("Email is required");
  }

  if (!validateEmail(email)) {
    throw new ValidationError("Invalid email format");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError("User not found");
    }
    const token = generatePasswordResetToken(user.id);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(token, salt);

    const update = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    const mail = await emailForgetPassword(token, [email]);
    return { mail, update };
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  forgetPassword,
};
