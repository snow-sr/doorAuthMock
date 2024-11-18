const express = require("express");
const axios = require("axios");
const verifyUser = require("../../Auth/Auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");
const { DOOR_KEY } = require("../../../config");
const { getIp } = require("../../health/Heartbeat/utils/health");



router = new express.Router();

router.get("/open", async (req, res) => {
    try{
        const ip = getIp();
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          res.status(403).json({ error: "User no have permision" });
        }
        else if (!ip) {
          res.status(500).json({ error: "Ip not found" });
        }
        await axios.get(ip + ":19003/open-door", { headers: { Authorization: "Bearer " + DOOR_KEY } });
        res.status(200).json({ message: "Door opened" });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info("Door opened");
    }
});

router.post("/alive", async (req, res ) => {
    try{
        console.log("imalive da porta aaaaaaaaaaaaa  \n", JSON.stringify(req))
    }
    catch(error){
        res.status(500).json()
    }
})

router.get("/mode", async (req, res) => {
    try{
        const ip = getIp();
        const { isVerify, isSuper } = await verifyUser.verifyUser(req.user);
        if (!isVerify || !isSuper) {
          res.status(403).json({ error: "User no have permision" });
        } else if (!ip) {
          res.status(500).json({ error: "Ip not found" });
        }
        const response = await axios.get(ip + ":19003//toggle-mode", {
          headers: { Authorization: "Bearer " + DOOR_KEY },
        });
        res.status(200).json(response.data);
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
    finally{
        logger.info("Door mode requested");
    }
});

module.exports = router;