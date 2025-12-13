const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `cover-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// File type check
function checkFileType(file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
}

// Multer upload (⬅ increased limit)
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).single("coverImage");

module.exports = upload;
