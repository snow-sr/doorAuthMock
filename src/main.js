const express = require("express");
const verifyToken = require("./middlewares/auth/auth");

const app = express();

const { auth } = require("./routes/Auth");
const { tags } = require("./routes/Tags");
const { door } = require("./routes/door");
const { user } = require("./routes/user");
const { logs } = require("./routes/Logs");
const { health } = require("./routes/health");

app.use("/auth", auth);
app.use("/logs", logs);
app.use("/health", health);

app.use("/tags", verifyToken, tags);
app.use("/door", verifyToken, door);
app.use("/user", verifyToken, user);


app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server online" });
});

module.exports = app;
