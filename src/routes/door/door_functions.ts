import express from "express";
const router = express.Router();
import { checkRfid, createRfid } from "../../db/db.js";

router.post("/", async (req: express.Request, res: express.Response) => {
    const Rfid: string = req.body.rfid;
    const check = await checkRfid(Rfid);
    if (check) {
        res.send("Door open");
    } else {
        res.status(401).send("Door closed");
    }
});

router.post("/create", async (req: express.Request, res: express.Response) => {
    const Rfid: string = req.body.rfid;
    const check = await createRfid(Rfid);
    if (check) {
        res.send("Rfid created");
    } else {
        res.status(401).send("Rfid not created");
    }
});
export default router;
