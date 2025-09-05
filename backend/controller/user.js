const User = require("../model/User");
const bcrypt = require('bcrypt')

// POST: Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If no role provided, it will be "user" by default
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role; // ✅ update role if provided

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json({
      message: "User updated",
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
