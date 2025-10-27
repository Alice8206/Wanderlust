const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapasync=require("../utils/asyncwrap.js");
const expressError=require("../utils/expressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


//search route
router.get("/search",wrapasync(listingController.searchListings));


router.route("/")
.get(wrapasync(listingController.index))
.post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapasync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);



router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapasync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapasync(listingController.destroyListing))
.get(wrapasync(listingController.showListing));


//edit route
router.get("/:id/edit",isLoggedIn,wrapasync(listingController.renderEditForm));



module.exports=router;