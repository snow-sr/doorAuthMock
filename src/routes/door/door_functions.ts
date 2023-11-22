import express from "express";
const router = express.Router();
import { checkRfid } from "../../db/db.js";

router.post("/", async (req: express.Request, res: express.Response) => {
    const Rfid: string = req.body.rfid;
    const check = await checkRfid(Rfid);
    if (check) {
        res.send("Door open");
    } else {
        res.status(401).send("Door closed");
    }
});

export default router;
