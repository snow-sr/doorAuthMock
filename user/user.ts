import express from "express";
import { listAllUser, createUser, assignRfidToUser } from "../db.js";
const router = express.Router();

router.post("/create/", ( req: express.Request, res: express.Response) => {
    const name: string = req.body.name;
    const email: string = req.body.email;

    createUser(name, email);

    res.send("User created");
})

router.get("/", async (req, res) => {
    const users = await listAllUser();
    res.send(users);
})

router.post("/assign/", async (req: express.Request, res: express.Response) => {
    const rfid: string = req.body.rfid;
    const email: string = req.body.email;

    await assignRfidToUser(rfid, email);

    res.send(`${rfid} assigned to ${email}`);
})

export default router;