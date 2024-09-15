const express = require('express');
const { loginUser, registerUser } = require('./utils/auth');
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

module.exports = router;
