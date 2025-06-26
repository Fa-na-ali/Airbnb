const express = require("express")
const router = express.Router({mergeParams:true})
const Listing = require("../models/listing")
const wrapAsync = require('../utils/wrapAsync')
const Review = require("../models/review")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const { createReview, destroyReview } = require("../controllers/review")


//Reviews
//Post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview))

//Delete review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(destroyReview))

module.exports = router