const listing = require("../models/listing.js");
const Reviews = require("../models/review.js");
module.exports.createReview=async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    newreview.author= req.user._id;
    Listing.reviews.push(newreview);
    await newreview.save();
    await Listing.save();
    req.flash("success", "Review is created!!");
    res.redirect(`/listing/${Listing._id}`);
  }
  module.exports.destroy=async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted!!");
    res.redirect(`/listing/${id}`);
  }