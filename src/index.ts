import door from "./routes/door/door_functions.js";
import user from "./routes/user/user_functions.js";
import express from "express";
import cors from "cors";
import bp from "body-parser";
const port: number = 8087;

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(door);
app.use(user);

app.get("/", (req: express.Request, res: express.Response) => {
  console.log(req.ip);
  res.send("System working");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
