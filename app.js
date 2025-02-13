if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.ATLASDB_URL;  
main().then(() => {
    console.log("connected");  
})
.catch((err) => {
    console.log(err);
});   

async function main() {
    await mongoose.connect(dbUrl);   
}


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
});

const sessionOptions = { 
    store,
    secret : process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpsonly : true,
    },
    
}


app.set("views", path.join(__dirname, "/views"));
app.set("views engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({extended : true}));

app.use(methodOverride("_method"));
  

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log(req.user);
    next();   
});
  
app.get("/register", async (req, res) => {
    let fakeUser = {
        email : "abc@gmail.com",
        username : "raju"
    }
    const registerUser = await User.register(fakeUser, "strong");
    res.send(registerUser);
});

app.use("/", userRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);



 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    console.log(err);
    res.status(statusCode).render("listings/error.ejs", {message});
});
app.listen(port, () => {
    console.log("listening");
});    
  