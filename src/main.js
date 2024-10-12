const express = require("express");

const { auth } = require("./routes/Auth");
const { tags } = require("./routes/Tags");
const { door } = require("./routes/door");
const { user } = require("./routes/user");
const verifyToken = require("./middlewares/auth/auth"); // Importe corretamente o middleware

const app = express();

app.use("/auth", auth); // Rota de autenticação (normalmente não precisa de token)

// Rotas protegidas por token
app.use("/tags", verifyToken, tags); // Adiciona o middleware para proteger a rota de tags
app.use("/door", verifyToken, door); // Adiciona o middleware para proteger a rota de door
app.use("/user", verifyToken, user); // Adiciona o middleware para proteger a rota de user

// Rota pública (não precisa de autenticação)
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server online" });
});

module.exports = app;
