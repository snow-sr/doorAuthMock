const express = require("express");
const { getAllUsers, getUserById, deleteUser, updateUser} = require("./utils/user");
const { logger } = require("../../../middlewares");
const { verifyUser } = require("../../Auth/Auth/utils/auth");

const router = new express.Router();

router.get("/users", async (req, res) => {
    try {
        const { isVerify } = await verifyUser(req.user);
        if (!isVerify) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const users = await getAllUsers();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify } = await verifyUser(req.user);
        if (!isVerify) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await getUserById(Number(id));
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify, isSuper } = await verifyUser(req.user);
        if (!isVerify || !isSuper) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await deleteUser(Number(id));
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, isVerify, isSuper } = req.body;
    try {
        const data = await verifyUser(req.user);
        if (!data.isVerify || !data.isSuper) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await updateUser(Number(id), { name, email, isVerify, isSuper });
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;