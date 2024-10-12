const express = require("express");
const axios = require("axios");
const verifyUser = require("../../user/Auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");


router = new express.Router();

router.get("/logs", async (req, res) => {
    try{
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          return res.status(403).json({ error: "User no have permision" });
        }
        const logs = await axios.get("http:///191.52.56.56:8087/logs", {
            headers: { 
                Authorization: "Bearer fabrica2420"
            }
        });
        logger.info("Logs retrieved successfully");
        res.status(200).json({ data: logs.data });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
});