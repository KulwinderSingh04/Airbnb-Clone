const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.createUser = async (req, res) => {
    try {
        let {username, password, email} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "Welcome To Wanderlust!");
            res.redirect("/listings");
        })
    }
    catch(er) {
        req.flash("error", er.message);
        res.redirect("/listings");
    }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs"); 
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome To Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash("success", "You Are Logged Out");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });

};