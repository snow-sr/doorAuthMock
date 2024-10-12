const express = require("express");
const { getAllUsers, getUserById, deleteUser} = require("./utils/user");
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
    finally {
        logger.info("User logged in successfully");
    }
    });

router.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify } = await verifyUser(req.user);
        if (!isVerify) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await getUserById(id);
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("User logged in successfully");
    }
    });

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { isVerify, isSuper } = await verifyUser(req.user);
        if (!isVerify || !isSuper) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await deleteUser(id);
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("User logged in successfully");
    }
});

module.exports = router;