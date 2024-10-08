const express = require("express");
const axios = require("axios");
const verifyUser = require("../../user/Auth/utils/auth");

router = new express.Router();

router.get("/open", async (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: "Token not provided" });
    }
    token = token.split(" ")[1];
    try{
        const { isVerify } = await verifyUser.verifyUser(token);
        if (!isVerify) {
          return new Error("User not authorized");
        }
        await axios.get("http://191.52.56.56/open-door", { headers: { Authorization: "Bearer fabrica2420" } });
        logger.info("Door oppened successfully");
        res.status(200).json({ message: "Door opened" });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;