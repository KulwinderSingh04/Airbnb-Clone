const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createReview = async(req, res) => {
    let {id} = req.params;
    let {rating, comment} = req.body;
    const listing = await Listing.findById(id);
    let newReview = new Review({
        comment : comment,
        rating : rating
    });
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect("/listings/" + id);
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    // console.log(review.author._id);
    // console.log(req.user._id);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};