import express from "express";
import { listAllUser, createUser, isUserSynced } from "../../db/db.js";
const router = express.Router();

router.post("/create/", (req: express.Request, res: express.Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;

  createUser(name, email);

  res.send("User created");
});

router.get("/users/", async (req, res) => {
  const users = await listAllUser();
  res.send(users);
});

// router.post("/assign/", async (req: express.Request, res: express.Response) => {
//   const rfid: string = req.body.rfid;
//   const email: string = req.body.email;

//   await assignRfidToUser(rfid, email);

//   res.send(`${rfid} assigned to ${email}`);
// });

router.post("/sync/", async (req: express.Request, res: express.Response) => {
  const name: string = req.body.name;

  await isUserSynced(name);

  res.send(`${name} synced`);
});

export default router;
