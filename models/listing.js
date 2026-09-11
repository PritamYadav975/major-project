const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    category: {
    type: String,
    enum: [
        "Trending",
        "Rooms",
        "Iconic Cities",
        "Mountain",
        "Amazing Pools",
        "Castles",
        "Farms",
        "Camping",
        "Adventures",
        "Beaches",
        "Sailing",
        "Wedding",
    ],
    required: true
},
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    geometry: {
    type: {
        type: String,
        enum: ["Point"],
        // required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

 ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
 });

 const Listing=mongoose.model("Listing",ListingSchema);
 module.exports=Listing;