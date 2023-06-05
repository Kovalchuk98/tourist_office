import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
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
    cb(null, "uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    req.body.img = file.originalname;
  },
});
const uploadImg = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: "8MB",
  },
});

export default {
  uploadImg,
};
