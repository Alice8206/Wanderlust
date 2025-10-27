const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");

//create route controller
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/Listings/${listing._id}`);
};

//delete route controller
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
   
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`)

};