
import express from 'express';
import { checkRfid, listAllRfids, createRfid, deleteRfid } from '../db.js';

const router = express.Router();

router.post("/door/", async (req: express.Request, res) => {
  const Rfid: string = req.body.rfid;
  const check = await checkRfid(Rfid);
  if (check) {
    res.send("Door open");
  } else {
    res.status(401).send("Door closed");
  }
});

router.get("/", async (req: express.Request, res: express.Response) => {
  let all = await listAllRfids();
  res.send(all);
})

router.post("/", async (req: express.Request, res: express.Response) => {
    const Rfid: string = req.body.rfid;
    const check = await checkRfid(Rfid);
    if (check) {
        res.status(401).send("Rfid already exists");
    } else {
        res.send(createRfid(Rfid));
    }
});

router.post("/delete/", async (req: express.Request, res: express.Response) => {
    const Rfid: string = req.body.rfid;
    const check = await checkRfid(Rfid);
    if (check) {
        res.send(deleteRfid(Rfid));
    } else {
        res.status(401).send("Rfid does not exist");
    }
});

export default router;
