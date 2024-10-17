const jwt = require("jsonwebtoken");

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  // Pega o header de autorização (certifique-se de que é minúsculo)
  const authHeader = req.headers['authorization'];

  // Verifica se o token está presente e no formato correto
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token malformado ou não fornecido." });
  }

  // Extrai o token do header
  const token = authHeader.split(" ")[1];

  // Define a chave secreta a partir da variável de ambiente ou usa um valor padrão (não recomendado para produção)
  const secretKey = process.env.JWT_SECRET || "defaultSecretKey";

  try {
    // Verifica o token usando a chave secreta
    const verified = jwt.verify(token, secretKey);

    // Se válido, adiciona o payload do token no req.user
    req.user = verified;
    
    // Prossegue para a próxima função/middleware
    next();
  } catch (err) {
    // Verifica o tipo de erro retornado pelo JWT e retorna uma mensagem apropriada
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado." });
    } else {
      return res.status(400).json({ message: "Token inválido." });
    }
  }
};

module.exports = verifyToken;
