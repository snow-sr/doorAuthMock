const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken, generatePasswordResetToken } = require('./token');
const validateEmail = require('../../../../helpers/validate/fields')
const {emailForgetPassword} = require("../../../../helpers/mail/mail");
// const { verifyToken } = require('./token');

const prisma = new PrismaClient();

async function registerUser(email, password, name) {
    if (!email || !password || !name) {
        return new Error('All fields are required');
    }

    if (!validateEmail(email)) {
        return new Error('Invalid email format');
    }

    if (password.length < 6) {
        return new Error('Password must be at least 6 characters long');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return new Error('Email is already in use');
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
        return new Error('Error creating user');
    }
}

async function loginUser(email, password) {
    if (!email || !password) {
        return new Error('Email and password are required');
    }

    if (!validateEmail(email)) {
        return new Error('Invalid email format');
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Error('Incorrect password');
        }

        const token = generateToken(user.id);
        await prisma.user.update({ where: { id: user.id }, data: { updated_at: new Date() } });
        return { token, user };
    } catch (error) {
        return new Error('Error during login');
    }
}

async function verifyUser(userData) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
    });
    if (!user) {
      return new Error("User not found");
    }
    console.log(user);
    const isSuper = user.isSuper;
    const isVerify = user.isVerified;
    return { isSuper, isVerify };
  } catch (error) {
    return new Error("Error getting user");
  }
}

async function forgetPassword(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user)
    if (!user) {
      throw new Error("User not found");
    }
    const token = generatePasswordResetToken(user.id);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(token, salt);
    console.log(user)
    const update = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log(update)
    const mail = await emailForgetPassword(email, token);
    return { mail };
  } catch (error) {
    throw new Error("Error getting usersss: "+  error);
  }
}

module.exports = {
  loginUser,
  registerUser,
  verifyUser,
  forgetPassword,
};
