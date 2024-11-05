const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require("../../../../config");

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return { error: error.message };
  }
  }

const generateToken = ((userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '3h' }); 
})

const generatePasswordResetToken = ((userId) => {
  const token = (jwt.sign({ userId }, SECRET_KEY, { expiresIn: "5m" })).slice(0, 10); 
  return token
})

module.exports = {
  verifyToken,
  generateToken,
  generatePasswordResetToken
};
