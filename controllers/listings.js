const Listing=require("../models/listing.js");

//index route controller
module.exports.index=async (req,res)=>{
     let allListings=await Listing.find({});
     res.render("listings/index.ejs",{allListings});
};

//new route controller
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

//show route controller
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if( !listing){
         req.flash("error","listing not exist!");
         return res.redirect("/Listings");
    }
    res.render("listings/show.ejs",{listing});

};

//create route controller
module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/Listings");
    

};

//edit route controller
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
         req.flash("error","listing not exist!");
        return  res.redirect("/Listings");
    }
    
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload/","/upload/w_200/"); //example transformation
    res.render("listings/edit.ejs",{listing,originalImageUrl});
    
};

//update route controller
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
     req.flash("success","listing updated!");
    res.redirect(`/Listings/${id}`);
};

//delete route controller
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted!");
    res.redirect("/Listings");
};

//search route controller
module.exports.searchListings= async (req, res) => {
  const query = req.query.q?.trim();

  try {
    if (!query) {
      req.flash("error", "Please enter something to search!");
      return res.redirect("/listings");
    }

    // Case-insensitive search on title or location
    const regex = new RegExp(query, "i");
    const listings = await Listing.find({
      $or: [{ title: regex }, { location: regex }]
    });

    res.render("listings/searchResult.ejs", { listings, query });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong with search.");
    res.redirect("/listings");
  }
};
