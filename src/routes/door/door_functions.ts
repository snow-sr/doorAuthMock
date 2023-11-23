import express from "express";
const router = express.Router();
import { checkRfid, listAllRfids, assignRfidToUser } from "../../db/db.js";

router.post("/door", async (req: express.Request, res: express.Response) => {
  const Rfid: string = req.body.rfid;
  const check = await checkRfid(Rfid);

  if (check) {
    res.send("Door open");
    return;
  }
  res.status(401).send("Door closed");
});

// router.post("/create", async (req: express.Request, res: express.Response) => {
//   const Rfid: string = req.body.rfid;
//   const check = await createRfid(Rfid);
//   if (check) {
//     res.send("Rfid created");
//   } else {
//     res.status(401).send("Rfid not created");
//   }
// });

router.get("/rfid", async (req: express.Request, res: express.Response) => {
  const rfids = await listAllRfids();
  res.send(rfids);
});

router.post("/assign", async (req: express.Request, res: express.Response) => {
  const Rfid: string = req.body.rfid;
  const userId: number = req.body.userId;
  const check = await assignRfidToUser(Rfid, userId);
  if (check) {
    res.send("Rfid assigned");
  } else {
    res.status(401).send("Rfid not assigned");
  }
});

export default router;
