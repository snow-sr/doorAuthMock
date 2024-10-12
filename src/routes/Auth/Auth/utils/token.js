const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecretKey';
function verifyToken(token) {
  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch (err) {
      return new Error('Token inválido');
    }
  }

const generateToken = ((userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '2h' }); 
})

const generatePasswordResetToken = ((userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' }); 
})

module.exports = {
  verifyToken,
  generateToken,
  generatePasswordResetToken
};
