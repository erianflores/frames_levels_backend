const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      n
      const theToken = req.headers.authorization.split(" ")[1];

      
      const data = jwt.verify(theToken, process.env.TOKEN_SECRET);


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
