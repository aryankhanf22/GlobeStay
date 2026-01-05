const listing = require("./models/listing.js");
const { listingscehmas } = require("./scehma.js");
const expressError = require("./utils/expressError");
const {reviewscehma }=require("./scehma.js")
const Reviews = require("./models/review.js");

module.exports.isLoggedin= (req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in")
        return res.redirect("/login")
    }
    next();
};
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}
module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
     let list = await listing.findById(id);
     if(!list.owner.equals(res.locals.currUser._id)){
req.flash("error","You don`t have permission to access")
return res.redirect(`/listing/${id}`)
     }
     next();
}
module.exports.validatelisting = (req, res, next) => {
  let { error } = listingscehmas.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}= reviewscehma.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errmsg)
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    let { id, reviewId } = req.params;
     let review = await Reviews.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
req.flash("error","You don`t have permission to delete")
return res.redirect(`/listing/${id}`)
     }
     next();
}
