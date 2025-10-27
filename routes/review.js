const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapasync=require("../utils/asyncwrap.js");
const expressError=require("../utils/expressError.js");
const Review=require("../models/reviews.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");








//create review route
router.post("/",validateReview,isLoggedIn,wrapasync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewController.destroyReview));

module.exports=router;