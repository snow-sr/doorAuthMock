const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { dateFormat } = require("../../../helpers/date/date");
const logger = require("../../../middlewares/logger/logger");
const io = require("../../../../app");

const prisma = new PrismaClient();
router = new express.Router();

router.post("/", async (req, res) => {
  let { type, message } = req.body;
  if (!type || !message) {
    return res.status(400).json({ error: "type and message are required" });
  }

  if (message !== String){
    message = JSON.stringify(message)
  }
  console.log(message)
  // Enviar a resposta imediatamente
  res.status(200).json({ message: "Log is being processed" });

  // Processar a criação do log e emitir evento de forma assíncrona
  try {
    const log = await prisma.logs.create({
      data: {
        type,
        message,
      },
    });

    // Emitir evento WebSocket após salvar no banco
    io.io.emit("logs", { data: log });
  } catch (error) {
    console.error("Erro ao processar log:", error.message);
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
