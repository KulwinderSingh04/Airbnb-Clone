const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});
router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('imageURL'), validateListing, wrapAsync(listingController.createListing));
 
// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm); 

router
    .route("/:id")
    .get(isLoggedIn, wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('imageURL'),validateListing, wrapAsync(listingController.updateListing))


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));  
  
// Update Route
router;


// Delete Route
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;