if(process.env.NODE_ENV !== "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
let path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
const ejsmate = require("ejs-mate")
app.engine("ejs", ejsmate);

const expressError=require("./utils/expressError.js")

async function main() {
    await mongoose.connect(process.env.MONGODB_URI)
}
main().then((res) => {
    console.log("Database connected successfully")
})
    .catch((err) => {
        console.log(err);
    })

const listingRouter= require("./routes/listing.js")
const reviewRouter= require("./routes/review.js")
const userRouter= require("./routes/user.js")
const User= require("./models/user.js")
const session= require("express-session")
const flash= require("connect-flash")
const passport=require("passport");
const localStrategy= require("passport-local");
const sessionOption={
    secret: "MysecretKey",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}
app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listing",listingRouter)
app.use("/listing/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let { status = 404, message = "Something went wrong" } = err
    res.status(status).render("error.ejs",{message})
    // res.status(status).send(message)
})

app.listen(8080, () => {
    console.log("App is listening")
})

