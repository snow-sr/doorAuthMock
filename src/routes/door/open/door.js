const express = require("express");
const axios = require("axios");
const verifyUser = require("../../User/Auth/utils/auth");

router = new express.Router();

router.get("/open", async (req, res) => {
    console.log(req.headers.authorization.split(" ")[1]);
    try{
        const { isVerify } = await verifyUser.verifyUser(req.headers.authorization.split(" ")[1]);
        if (!isVerify) {
          throw new Error("User not authorized");
        }
        const response = await axios.get("http://191.52.56.177/open-door", { headers: { Authorization: "Bearer fabrica2420" } });
        console.log(response.data);
        res.status(200).json({ message: "Door opened" });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;