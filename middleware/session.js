const authenticateToken = (req, res, next) => {
  // Get token from request header
  const token = req?.header("Authorization")?.split(" ")[1]; // Assuming the token is passed in the form 'Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "yourSecretKey"); // Replace with your actual secret key
    req.user = decoded; // Attach the decoded user data to request
    next(); // Call the next middleware or route handler
  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export { authenticateToken };
