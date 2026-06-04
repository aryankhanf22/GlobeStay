const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedin,upload.single("listing[image]"), validatelisting,wrapAsync(listingController.create));
// new route
router.get("/new", isLoggedin, listingController.renderNewform);

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(isLoggedin, isOwner, upload.single("listing[image]"),validatelisting, wrapAsync(listingController.edit))
  .delete(isLoggedin, isOwner, wrapAsync(listingController.delete));

// edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editForm),
);
module.exports = router;
