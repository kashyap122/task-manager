const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization"); // This splits the "Bearer <token>" string and gets the token
    
    console.log("this is token:", token); // Log the token to ensure it's being extracted correctly
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access!" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded); // Log the decoded user data
    
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
