const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ include role
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 LOGIN ATTEMPT:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // 🔥 DEBUG: user from DB
    console.log("👤 USER FROM DB:", user);

    if (!user) {
      console.log("❌ USER NOT FOUND");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // 🔥 DEBUG: password check
    console.log("🔑 PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ WRONG PASSWORD");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    // 🔥 DEBUG: token + role
    console.log("✅ LOGIN SUCCESS");
    console.log("🎭 USER ROLE:", user.role);
    console.log("🪪 TOKEN:", token);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};