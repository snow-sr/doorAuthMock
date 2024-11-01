const express = require("express");
const axios = require("axios");
const verifyUser = require("../../Auth/Auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");
const { DOOR_KEY } = require("../../../config");



router = new express.Router();

router.get("/open", async (req, res) => {
    try{
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          res.status(403).json({ error: "User no have permision" });
        }
        await axios.get("http://191.52.57.200:19003/open-door", { headers: { Authorization: "Bearer " + DOOR_KEY } });
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

module.exports = router;