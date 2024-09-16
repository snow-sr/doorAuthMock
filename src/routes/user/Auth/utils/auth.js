const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('./token');
const validateEmail = require('../../../../helpers/validate/fields')
const { verifyToken } = require('./token');

const prisma = new PrismaClient();

async function registerUser(email, password, name) {
    if (!email || !password || !name) {
        throw new Error('All fields are required');
    }

    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email is already in use');
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
        throw new Error('Error creating user');
    }
}

async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    if (!validateEmail(email)) {
        throw new Error('Invalid email format');
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Incorrect password');
        }

        const token = generateToken(user.id);
        await prisma.user.update({ where: { id: user.id }, data: { updated_at: new Date() } });
        return { token, user };
    } catch (error) {
        throw new Error('Error during login');
    }
}

async function getUserById(userId) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        delete user.password;
        return { user };
    } catch (error) {
        throw new Error('Error getting user');
    }
}

async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
            throw new Error('No users found');
        }
        users.forEach((user) => {
            delete user.password;
        });
        return { users };
    } catch (error) {
        throw new Error('Error getting users');
    }
}

async function deleteUser(userId) {
    try {
        const user = await prisma.user.delete({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return { user };
    } catch (error) {
        throw new Error('Error deleting user');
    }
}

async function verifyUser(token){
    try{
        const data = verifyToken(token);
        console.log(data)
        if (!data) { 
          throw new Error("User not found");
        }
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        console.log(user)
        const isSuper = user.isSuper;
        const isVerify = user.isVerified
        return { isSuper, isVerify };
    }
    catch (error) {
        throw new Error('Error getting user');
    }
}
module.exports = {
    loginUser,
    registerUser,
    getUserById,
    getAllUsers,
    deleteUser,
    verifyUser
};
