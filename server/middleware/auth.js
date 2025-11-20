const jwt = require('jsonwebtoken');

const authenticateToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded; // Returns { id, role, iat, exp }
  } catch (error) {
    return null;
  }
};

module.exports = authenticateToken;
