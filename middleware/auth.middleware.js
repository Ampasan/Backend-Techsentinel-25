const jwt = require("jsonwebtoken");

function authorization(roles = []) {
  return function (req, res, next) {
    try {
      let token;
      let user = { role: "guest" };

      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (token) {
          user = jwt.verify(token, process.env.JWT_SECRET);
        }
      }
      req.user = user;

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error.message);
      res.status(401).json({
        success: false,
        message: "Authorization failed",
        error: error.message,
      });
    }
  };
}

module.exports = authorization;