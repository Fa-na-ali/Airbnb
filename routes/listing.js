const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Listing = require("../models/listing")
const { isLoggedIn, isOwner, validateListing } = require("../middleware")
const { index, newRouteForm, showListing, createListing, renderEditForm, destroyListing, updateListing } = require("../controllers/listings")

router.route('/')
.get(index)
.post(isLoggedIn, validateListing, wrapAsync(createListing));

router.get("/new", isLoggedIn, newRouteForm);

router.route('/:id')
.get(wrapAsync(showListing))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(destroyListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router