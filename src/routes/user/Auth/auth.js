const express = require('express');
const { loginUser, registerUser, getAllUsers, getUserById, deleteUser, verifyUser } = require('./utils/auth');
const { validateRequestBody } = require('../../../helpers/validate/request');
const { logger } = require('../../../middlewares');
const { verifyToken } = require('./utils/token');

const router = new express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const error = validateRequestBody(['email', 'password'], req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const { token, user } = await loginUser(email, password);
        delete user.password;
        res.status(200).json({ token: token, data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User logged in successfully');
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const error = validateRequestBody(['name', 'email', 'password'], req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        await registerUser(email, password, name);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User registered successfully');
    }
});
 

router.get('/users', async (req, res) => {
    try {
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const users = await getAllUsers();
        res.status(200).json({data: users});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('All users retrieved successfully');
    }
});

router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const user = await getUserById(Number(id));
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User retrieved successfully');
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const user = await deleteUser(Number(id));
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User deleted successfully');
    }
});

router.get('/verify', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const userData = verifyToken(token);
        const { isSuper } = await verifyUser(userData);
        res.status(200).json({data: isSuper});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User verified successfully');
    }
});

router.post('/forget', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await forgetPassword(email);
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info('User forgot password successfully');
    }
});

module.exports = router;
