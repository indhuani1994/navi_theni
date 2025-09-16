const express = require("express");
const { 
 registerUser,getUserById,getUsers,updateUser,
 checkEmailExists
} = require("../controller/user");

const router = express.Router();

// 🔹 POST - Create/Register User
router.post("/", registerUser);

// 🔹 GET - Get all users
router.get("/", getUsers);
router.get("/check-email", checkEmailExists);

// 🔹 GET - Get single user by ID
router.get("/:id", getUserById);

// 🔹 PUT - Update user
router.put("/:id", updateUser);



module.exports = router;
