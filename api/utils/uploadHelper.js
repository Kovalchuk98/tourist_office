import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "file") {
      cb(null, "uploads/documents/");
    } else if (file.fieldname === "cimg") {
      cb(null, "uploads/images/");
    } else if (file.fieldname === "img") {
      cb(null, "uploads/images/");
    }
  },
  filename: function (req, file, cb) {
    let name = Date.now() + path.extname(file.originalname);

    if (file.fieldname === "file") {
      req.body.file = name;
      cb(null, name);
    } else if (file.fieldname === "cimg") {
      req.body.cimg = name;
      cb(null, name);
    } else if (file.fieldname === "img") {
      req.body.img = name;
      cb(null, name);
    }
  },
});
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: "8MB",
  },
});

export default {
  upload,
};
