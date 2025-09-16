const User = require("../model/User");

// POST: Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, gender, age, role, address } = req.body;

    if (!name || !email || !phoneNumber || !gender || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    // Check if phone already exists
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) return res.status(400).json({ message: "Phone number already exists" });

    // Create user (role defaults to "user" if not provided)
    const user = await User.create({
      name,
      email,
      phoneNumber,
      gender,
      age,
      role: role || "user",
      address: address || "",  // 👈 include address
    });

    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, gender, age, role, address } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.role = role || user.role;
    user.address = address || user.address;  // 👈 include address

    const updatedUser = await user.save();

    res.json({
      message: "User updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if email exists
exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
