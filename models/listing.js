const mongoose= require("mongoose");
const Review = require("./review");
const User= require("./user")
const Schema=mongoose.Schema;
const listingschema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        default:1
    },
    location:{
        type:String,
    },
    country:{
        type:String,
        default:"pakistan"
    },
   reviews: [
  {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
],
owner:{
      type: Schema.Types.ObjectId,
    ref: "User"
},
geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
}
})
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : { $in : listing.reviews}});
    }})
const listing=mongoose.model("listing",listingschema);
module.exports=listing;