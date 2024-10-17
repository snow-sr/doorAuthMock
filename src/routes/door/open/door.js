const express = require("express");
const axios = require("axios");
const verifyUser = require("../../Auth/Auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");

router = new express.Router();

router.get("/open", async (req, res) => {
    try{
        const { isVerify } = await verifyUser.verifyUser(req.user);
        if (!isVerify) {
          return res.status(403).json({ error: "User no have permision" });
        }
        await axios.get("http://191.52.56.56/open-door", { headers: { Authorization: "Bearer fabrica2420" } });
        res.status(200).json({ message: "Door opened" });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
});

router.get("/logs", async (req, res) => {
  try {
    const { isVerify } = await verifyUser.verifyUser(req.user);
    if (!isVerify) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const logs = await axios.get("http://191.52.56.56:8087/logs", {
      headers: {
        Authorization: "Bearer fabrica2420",
      },
    });
    res.status(200).json({ data: logs.data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;