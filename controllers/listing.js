const listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    let lists = await listing.find();
    res.render("./listing/index.ejs", { lists });
  }

  module.exports.renderNewform=(req, res, next) => {
  res.render("./listing/new.ejs");
}
 module.exports.show=async (req, res) => {
    let { id } = req.params;
    let list = await listing
      .findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!list) {
      req.flash("error", "This listing does not exist");
      return res.redirect("/listing");
    }
    res.render("./listing/show.ejs", { list });
  }
  module.exports.create = async (req, res) => {
  const location = req.body.listing.location;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    location
  )}&key=${process.env.MAP_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  const loc = data.results[0].geometry.location;
  const newlisting = new listing(req.body.listing);
  newlisting.geometry = {
    type: "Point",
    coordinates: [loc.lng, loc.lat],
  };

  let urlImg = req.file.path;
  let filename = req.file.filename;
  newlisting.image = { url: urlImg, filename };
  newlisting.owner = req.user._id;
  await newlisting.save();

  req.flash("success", "New list is created!!");
  res.redirect("/listing");
};
     module.exports.editForm=async (req, res) => {
         let { id } = req.params;
         let list = await listing.findById(id);
         if (!list) {
           req.flash("error", "This listing does not exist");
           return res.redirect("/listing");
         }
         let originalimageurl = list.image.url;
         originalimageurl=originalimageurl.replace("/upload", "/upload/h_100,w_100,c_fill");
         res.render("./listing/edit.ejs", { list ,originalimageurl});
       }
       module.exports.edit=async (req, res) => {
           let { id } = req.params;
           let list = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== 'undefined'){
       let url=req.file.path;
    let filename=req.file.filename;
            list.image = { url, filename };
            await list.save();
          }
           req.flash("success", "List is Updated!!");
           res.redirect(`/listing/${id}`);
         }
         module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let list = await listing.findByIdAndDelete(id);
    req.flash("success", "List is Deleted!!");
    res.redirect("/listing");
  }