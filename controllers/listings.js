const Listing=require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAP_TOKEN;
// module.exports.index=async(req,res)=>{
//    const allListings=await Listing.find({});
//       res.render("listings/index.ejs",{allListings});
//     };


module.exports.index = async (req, res) => {

    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.searchListings = async (req, res) => {
    const { country } = req.query;

    const allListings = await Listing.find({
        country: { $regex: `^${country}$`, $options: "i" }
    });

    if (allListings.length === 0) {
        req.flash("error", `No listings from ${country}`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req,res)=>{
   
      res.render("listings/new.ejs");
    };

module.exports.showListing=async(req,res)=>{
      let{id}=req.params;
      const listing=await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
          path:"author",
        },
      })
      .populate("owner");
      if(!listing){
         req.flash("error","Listing you want does not exist!");
          return res.redirect("/listings");
        }
        console.log(listing);
      res.render("listings/show.ejs",{listing});
    };

module.exports.createListing=async(req,res,next)=>{
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,"..",filename);
    //let {title,desription,image,price,country,location}req.body;
      // if(!req.body.listing){
      //   throw new ExpressError(400,"Send Valid data for listing");
      // }

    const result = await maptilerClient.geocoding.forward(
        req.body.listing.location
    );

    const coordinates =  result.features[0].geometry.coordinates;
   
    const  newlisting= new Listing(req.body.listing);
        newlisting.geometry = {
        type: "Point",
        coordinates: coordinates
    };
           // if(!newListing.title){
           //           throw new ExpressError(400,"Title is missing");
           // }
           // if(!newListing.description){
           //           throw new ExpressError(400,"Description is missing");
           // }
           // if(!newListing.location){
           //           throw new ExpressError(400,"Location is missing");
           // }
        
        newlisting.owner=req.user._id;
        newlisting.image={url,filename};
         await newlisting.save();
         
         req.flash("success","New Listing Created!");
         // console.log(listing);
         res.redirect("/listings");
        
         };

module.exports.renderEditForm=async (req, res) => {
           let { id } = req.params;
           const listing = await Listing.findById(id);
              if(!listing){
                  req.flash("error","Listing you want does not exist!");
                    return res.redirect("/listings");
                 }
             let originalImageUrl=listing.image.url;
             originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250"); 

           res.render("listings/edit.ejs", { listing,originalImageUrl});
         };

module.exports.updateListing=async (req, res) => {
           // if(!req.body.listing){
           //       throw new ExpressError(400,"Send Valid data for listing");
           //     }
           let { id } = req.params;
           // Geocode the new location
           const result = await maptilerClient.geocoding.forward(
            req.body.listing.location
            );

          const coordinates = result.features[0].geometry.coordinates;

          let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing },{new:true});
          
          //update geometry
          listing.geometry = {
            type: "Point",
            coordinates: coordinates
          };

          if(typeof req.file !=="undefined"){
           let url=req.file.path;
          let filename=req.file.filename;
          listing.image={url,filename};
          };
           await listing.save();
           req.flash("success","Listing updated!");
           res.redirect(`/listings/${id}`);
        
         }
          
 module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};