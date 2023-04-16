// Import the Multer library for handling file uploads
const multer = require("multer");

// Define a function to filter uploaded files by MIME type
const pdfFilter = (req, file, cb) => {
  if (file.mimetype.includes("pdf")) { // Check if the MIME type includes "pdf"
    cb(null, true); // If it does, allow the upload
  } else {
    return cb(new Error("Only pdfs are allowed")); // If it doesn't, reject the upload with an error
  }
};

// Define an object that configures how uploaded files are stored
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Store files in the "public/uploads/" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-result-${file.originalname}`); // Generate a unique filename based on the current timestamp and original filename
  },
});

// Create a configured instance of the Multer middleware
var uploadFile = multer({ storage: storage, fileFilter: pdfFilter });

// Export the Multer middleware for use in other parts of the application
module.exports = uploadFile;
