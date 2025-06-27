const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn, isOwner, validateListing } = require("../middleware")
const { index, newRouteForm, showListing, createListing, renderEditForm, destroyListing, updateListing } = require("../controllers/listings")
const multer = require("multer")
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.route('/')
    .get(index)
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createListing));

router.get("/new", isLoggedIn, newRouteForm);

router.route('/:id')
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router