const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true,  },
    phoneNumber: { type: String, required: true, unique: true }, // 👈 New field
    gender: { type: String, enum: ["male", "female", "other"], required: true }, // 👈 New field
    age: { type: Number, min: 1, max: 120, required: true }, // 👈 New field
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // 👈 Default role
    },
    address:{
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
