const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/stores";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // make sure folder exists
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});






module.exports = upload;
