const express = require('express');
const { loginUser, registerUser, getAllUsers, getUserById, deleteUser, verifyUser } = require('./utils/auth');
const { validateRequestBody } = require('../../../helpers/validate/request');

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
});
 

router.get('/users', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const { isSuper } = await verifyUser(token);
    if(!isSuper){
        return res.status(403).json({ error: 'User is not super' });
    }
    try {
        const users = await getAllUsers();
        res.status(200).json({data: users});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { isSuper } = await verifyUser(token);
    if (!isSuper) {
        return res.status(403).json({ error: "User is not super" });
    }
    const { id } = req.params;
    try {
        const user = await getUserById(Number(id));
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { isSuper } = await verifyUser(token);
    if (!isSuper) {
        return res.status(403).json({ error: "User is not super" });
    }
    const { id } = req.params;
    try {
        const user = await deleteUser(Number(id));
        res.status(200).json({data: user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/verify', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const { isSuper } = await verifyUser(token);
        res.status(200).json({data: isSuper});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
