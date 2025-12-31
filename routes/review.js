const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
const { validatereview,isLoggedin,isReviewAuthor } = require("../middleware.js");
const reviewController= require("../controllers/review.js")
// create route
router.post(
  "/",
  isLoggedin,
  validatereview,
  wrapAsync(reviewController.createReview)
);
//delete route
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroy)
);

module.exports = router;
