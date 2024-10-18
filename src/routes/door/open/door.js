const express = require("express");
const axios = require("axios");
const verifyUser = require("../../Auth/Auth/utils/auth");
const logger = require("../../../middlewares/logger/logger");
const { dateFormat } = require("../../../helpers/date/date");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { parseISO, isValid } = require("date-fns");

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

router.get("/logs/all", async (req, res) => {
  try {
    const { isVerify } = await verifyUser.verifyUser(req.user);
    if (!isVerify) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const logs = await prisma.logs.findMany()

    if (!logs.length) {
      throw new NotFoundError("No logs found");
    }

    logs.forEach((log) => {
      log.date = dateFormat(log.date);
    });
    res.status(200).json({ data: logs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/logs", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required" });
  }

  const start = parseISO(startDate);
  const end = parseISO(endDate);

   if (!isValid(start) || !isValid(end)) {
     return res
       .status(400)
       .json({
         message:
           "Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).",
       });
   }
  try {
    const { isVerify } = await verifyUser.verifyUser(req.user);
    if (!isVerify) {
      return res.status(403).json({ error: "User no have permision" });
    }
    const logs = await prisma.logs.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!logs.length) {
      throw new NotFoundError("No logs found");
    }

    logs.forEach((log) => {
      log.date = dateFormat(log.date);
    });
    res.status(200).json({ data: logs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;