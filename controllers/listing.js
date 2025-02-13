const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});   
};

module.exports.renderNewForm = (req, res) => {     
    res.render("listings/new.ejs");           
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");  
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename
    let {title : t, description : d, price : p, location : l, country : c} = req.body;
    let newListing = new Listing({   
        title : t, 
        description : d,    
        price : p, 
        image : {  
            filename,
            url
        },  
        location : l,      
        country : c  
    });
    newListing.owner = req.user._id;
    await newListing.save();  
    req.flash("success", "New Listing Created!");
    res.redirect("/listings"); 
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;    
    const listing = await Listing.findById(id);   
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let {title : t, description : d, price : p, imageURL : i, location : l, country : c} = req.body;
    let listing = await Listing.findByIdAndUpdate(id, {
        title : t, 
        description : d,    
        price : p,
        location : l, 
        country : c
    });
    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image.url = url;
        listing.image.filename = filename;
        await listing.save();
    }  
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};  