const jwt = require("jsonwebtoken");

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // O token deve vir no header "Authorization" no formato "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  try {
    const verified = jwt.verify(token, "defaultSecretKey"); // Verifica o token usando a chave secreta
    console.log(verified)
    req.user = verified; // Se válido, adiciona o payload do token no req.user
    console.log('entrou nessa poraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    next(); // Prossegue para a próxima função/middleware
  } catch (err) {
    res.status(400).json({ message: "Token inválido." });
  }
};

module.exports = verifyToken;
