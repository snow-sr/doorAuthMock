import express from "express";
import bp from "body-parser";
import rfidRoutes from "./rfid/rfid.js";
import userRoutes from "./user/user.js";
const port: number = 8087;


const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/rfid", rfidRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Basic door api");
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
