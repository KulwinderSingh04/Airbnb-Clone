const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.createUser));

router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}) , userController.loginUser);

router.get("/logout", userController.logoutUser);
module.exports = router;  