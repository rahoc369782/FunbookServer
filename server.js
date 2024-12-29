import express from "express";
import cors from "cors"; // Middleware for Cross-Origin Resource Sharing (optional)
import bodyParser from "body-parser"; // Middleware for parsing JSON and URL-encoded data
import { authenticateUser } from "./utils/userAuth.js";
import { authenticateToken } from "./middleware/session.js";

// Initialize the app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Set a port
const PORT = 8000;

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Example route for authentication
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await authenticateUser(username, password);

  if (result.success) {
    res.status(200).json({ message: result.message, token: result.token });
  } else {
    res.status(401).json({ message: result.message });
  }
});

app.get("/data", authenticateToken, (req, res) => {
  res.json({ message: "Data received", data });
});

// Add a 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
