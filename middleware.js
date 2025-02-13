const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "User is Not logged in!");
        res.redirect("/login");
    } 
    else next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "You are not the owner of this Listing!");
        return res.redirect(`/listings/${req.params.id}`);
    } 
    next();
}

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    console.log(result);
    if(result.error) {
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
}

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error) {
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    const review = await Review.findById(reviewId).populate("author");
    if(!review.author._id.equals(req.user._id)) {
        req.flash("error", "This is not Your Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}