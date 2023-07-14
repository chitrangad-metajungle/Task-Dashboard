const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  const secret_key = process.env.SECRET_KEY
  jwt.verify(token, secret_key, (err, res) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = res.user;
    next();
  });
}

module.exports = authenticateToken;
