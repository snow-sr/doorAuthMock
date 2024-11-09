const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { dateFormat } = require("../../../helpers/date/date");
const logger = require("../../../middlewares/logger/logger");
const io = require("../../../../app");

const prisma = new PrismaClient();
router = new express.Router();

router.post("/", async (req, res) => {
  const { type, message } = req.body;
  let logdps; 
  if (!type || !message) {
    return res.status(400).json({ error: "type and message are required" });
  }

  try {
     const log = await prisma.logs.create({
       data: {
         type,
         message,
        },
     });

     if (!log) {
       return res.status(400).json({ error: "Error creating log" });
     }
     logdps = log
     res.status(200).json({ message: "Log created" });
     
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
    io.io.emit("logs", { data: logdps });
  }
});

router.get("/", async (req, res) => {
  try {
    const logs = await prisma.logs.findMany();
    logs.forEach((log) => {
      log.date = dateFormat(log.date);
    });
    res.status(200).json({ data: logs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

module.exports = router;
