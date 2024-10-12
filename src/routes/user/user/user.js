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
        console.log(error)
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("Users retourned successfully");
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
        console.log(error)
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("User by id retourned successfully");
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
        console.log(error)
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("User deleted successfully");
    }
});

router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const { isVerify, isSuper } = await verifyUser(req.user);
        if (!isVerify || !isSuper) {
        return res.status(403).json({ error: "User no have permision" });
        }
        const user = await updateUser(id, { name, email });
        res.status(200).json({ data: user });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
    finally {
        logger.info("User updated successfully");
    }
});

module.exports = router;