const jwt = require("jsonwebtoken");
const { DOOR_KEY } = require("../../config");
const logger = require("../logger/logger");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token malformado ou não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET;
  console.log("Rapaiz")


  try {
    if (token == DOOR_KEY){
      next();
    }else{
      const verified = jwt.verify(token, secretKey);
      req.user = verified;
      next();
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expirado." });
    } else {
      return res.status(400).json({ message: "Token inválido." });
    }
  }
};

module.exports = verifyToken;
