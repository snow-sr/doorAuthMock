import door from "./routes/door/door_functions";
import user from "./routes/user/user_functions";
import express from "express";
import bp from "body-parser";
const port: number = 8087;

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(door);
app.use(user);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
