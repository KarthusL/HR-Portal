const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/json"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only .png, .jpg, .jpeg and .pdf format allowed!";
    const err = new Error("Only .png, .jpg, .jpeg and .pdf format allowed!");
    err.statue = 409;
    cb(err, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
