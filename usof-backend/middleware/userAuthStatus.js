const jwt = require('jsonwebtoken');

module.exports = () => async (req, res, next) => {
    if (req.method === "OPTIONS"){
      next();
    }

    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRETKEY || 'ucode');
      req.user = decoded;

      next(); 
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ message: "Unauthorized" });
    }
}
