const { Level } = require("level"); // Import the 'level' package
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Initialize the LevelDB database with a directory path
const db = new Level("user_db"); // The 'user_db' directory will store the database
// Sample function to add a user (for demonstration)
// Function to add a user with additional information
const addUser = async (username, password, name, sessionData, profile) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10); // Hash the password securely
    const user = {
      password: hashPassword,
      name: name, // User's name
      sessionData: sessionData, // Session data (can be any object)
      profile: profile, // User profile (can be a URL, image, etc.)
      lastLogin: new Date().toISOString(), // Store the current timestamp for the last login
    };

    // Store the user data as a JSON string
    await db.put(username, JSON.stringify(user));

    console.log(`User ${username} added successfully:`);
    console.log(await db.get(username)); // Log the user data from DB for confirmation
  } catch (err) {
    console.error("Error adding user:", err);
  }
};

const authenticateUser = async (username, password) => {
  try {
    const userData = await db.get(username);
    const parsedUserData = JSON.parse(userData);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      parsedUserData.password
    );
    if (isPasswordCorrect) {
      console.log("Authentication successful");

      // Generate JWT token
      const token = jwt.sign(
        { username: parsedUserData.username },
        "yourSecretKey", // Replace this with a secure secret key
        { expiresIn: "1h" } // Token expiry time (1 hour in this case)
      );

      return {
        success: true,
        message: "Authentication successful",
        token: token,
      };
    } else {
      console.log("Invalid credentials");
      return { success: false, message: "Invalid credentials" };
    }
  } catch (err) {
    if (err.notFound) {
      console.log("User not found");
      return { success: false, message: "User not found" };
    } else {
      console.error("Error during authentication:", err);
      return {
        success: false,
        message: "An error occurred during authentication",
      };
    }
  }
};

export { addUser, authenticateUser };
