const express = require("express");
const imageController = require("./../controllers/imageController");

const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(imageController.uploadImage);

module.exports = router;