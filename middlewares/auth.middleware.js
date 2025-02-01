const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      
      const theToken = req.headers.authorization.split(" ")[1];
      console.log("Token received:", theToken);
      
      const data = jwt.verify(theToken, process.env.TOKEN_SECRET);
      console.log("Decoded Token:", data)

      req.payload = data;

    
      next();
    } else {

      res.status(403).json({ message: "Headers malformed or missing" });
    }
  } catch (error) {
    
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
