import { checkRfid } from "./db.js";
import express from "express";
import bp from "body-parser";
const port: number = 8087;

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Basic door api");
});

app.post("/door", async (req: express.Request, res) => {
  const Rfid: string = req.body.rfid;
  const check = await checkRfid(Rfid);
  if (check) {
    res.send("Door open");
  } else {
    res.status(401).send("Door closed");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
