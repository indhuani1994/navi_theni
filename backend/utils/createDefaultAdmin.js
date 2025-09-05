const User = require("../model/User");
const bcrypt = require("bcrypt");

async function createDefaultAdmin() {
  try {
    const adminEmail = "admin@hydroserve.com"; // default email
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashpassword = await bcrypt.hash("admin123", 10); // default password

      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashpassword,
        role: "admin",
      });

      console.log(
        "✅ Default Admin Created: email=admin@hydroserve.com, password=admin123"
      );
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
}

module.exports = createDefaultAdmin;
