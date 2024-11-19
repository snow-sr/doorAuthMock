const express = require("express");
const verifyToken = require("./middlewares/");
const RateLimit = require("express-rate-limit");

const app = express();

const { auth } = require("./routes/Auth");
const { tags } = require("./routes/Tags");
const { door } = require("./routes/door");
const { user } = require("./routes/user");
const { logs } = require("./routes/Logs");
const { health } = require("./routes/health");

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // max 100 requests per windowMs
});

app.use("/auth", auth);
app.use("/logs", verifyToken, logs);
app.use("/health", health);

app.use("/tags", limiter, verifyToken, tags);
app.use("/door", limiter, verifyToken, door);
app.use("/user", limiter, verifyToken, user);


app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server online" });
});

module.exports = app;
