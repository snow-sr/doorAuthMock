import express from "express";
import { listAllUser, createUser} from "../../db/db.js";
const router = express.Router();

router.post("/create/", async (req: express.Request, res: express.Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  await createUser(name, email, password);

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

export default router;