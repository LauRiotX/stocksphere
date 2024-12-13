const UserService = require('../../services/user.js');
const jwt = require('jsonwebtoken');

const authenticateWithToken = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const m = authHeader.match(/^(Token|Bearer) (.+)/i);
    if (m) {
      UserService.authenticateWithToken(m[2])
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          next(err);
        });
      return;
    }
  }

  next();
};

const requireUser = (req, res, next) => {
  console.log('Authorization header:', req.headers.authorization);
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found in Authorization header');
    return res.status(401).json({ message: req.t('unauthorized') });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = { id: decoded.userId };
    console.log('User set in request:', req.user);
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(403).json({ error: req.t('authenticationRequired') });
  }
};

module.exports = {
  authenticateWithToken,
  requireUser,
};