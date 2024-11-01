const express = require("express");
const logger = require("../../../middlewares/logger/logger");
const { checkHealth, checkIp } = require("./utils/health");

const router = new express.Router();

router.post("/health", async (req, res) => {
    try {
        const health = await checkHealth();
        res.status(200).json({ health });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

router.post("/ip", async (req, res) => {
    const { ip } = req.body;
    try {
        const ipResponse = await checkIp(ip);
        res.status(200).json({ message: "Ip saved", ip: ipResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;