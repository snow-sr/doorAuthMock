const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecretKey';
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return { error: error.message };
  }
  }

const generateToken = ((userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '2h' }); 
})

const generatePasswordResetToken = ((userId) => {
  const token = (jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" })).slice(0, 10); 
  return token
})

module.exports = {
  verifyToken,
  generateToken,
  generatePasswordResetToken
};
