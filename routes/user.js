const express = require("express")
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const { signup, renderSignupForm, renderLoginForm, login, logout } = require("../controllers/user.js")

router.route("/signup")
.get(renderSignupForm)
.post(wrapAsync(signup))

router.route('/login')
.get(renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
login)

router.get("/logout", logout)

module.exports= router;