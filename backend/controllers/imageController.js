const multer = require("multer");
const sharp = require("sharp");
const ImageMetadata = require("../models/ImageMetadataModel");

const IMG_DIRECTORY_PATH = "public/img";
const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg"];
const IMG_SIZE = [400, 400];

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMG_DIRECTORY_PATH);
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const name = req.body.name
      .trim()
      .toLowerCase()
      .replace(/å|ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/\s/g, "-")
      .replace(/[^a-z0-9|-]+/g, "")
      .substring(0, 10)
      .concat(`_${Date.now()}`);

    cb(null, `${name}.${extension}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) =>
    cb(null, ACCEPTED_MIME_TYPES.includes(file.mimetype)),
});

exports.getAllImages = async (req, res, next) => {
  const data = await ImageMetadata.find();

  return res.status(200).json({
    status: "success",
    data: data,
  });
};

exports.uploadImage = upload.single("photo");

exports.resizeImage = async (req, res, next) => {
  const [width, height] = IMG_SIZE;
  const buffer = await sharp(req.file.path)
    .resize(width, height)
    .toBuffer(req.file.path);
  sharp(buffer).toFile(`${IMG_DIRECTORY_PATH}/${req.file.filename}`);

  next();
};

exports.createImageMetadata = async (req, res, next) => {
  const doc = await ImageMetadata.create({
    name: req.body.name,
    path: `/img/${req.file.filename}`,
  });

  if (!doc) {
    return res.status(400).json({
      status: "fail",
      message: "invalid input",
    });
  }

  return res.status(201).json({
    status: "success",
    data: doc,
  });
};
