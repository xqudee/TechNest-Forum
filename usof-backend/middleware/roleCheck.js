const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);
require('dotenv').config();

module.exports = (role) => async (req, res, next) => {
    if (req.method === 'OPTIONS') {
      return next();
    }
  
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
      }
  
      const decoded = await verifyAsync(token, process.env.SECRETKEY || 'ucode');

      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'You don\'t authorize' });
    }
};