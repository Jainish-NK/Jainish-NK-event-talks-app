const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password." });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "default_jwt_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username,
        name: "Jainish Khunt",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server authentication error.", error: error.message });
  }
};
