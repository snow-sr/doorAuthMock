import { checkRfid } from "./db.js";
import express from "express";
const port: number = 8087;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Basic door api");
});

app.post("/door", async (req, res) => {
  const Rfid: string = req.body.rfid;
  console.log(req.body);
  console.info(Rfid);
  const check = await checkRfid(Rfid);
  if (check) {
    res.send("Door open");
  }
  res.send("Door closed");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
