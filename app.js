const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/expressError')
const { listingSchema, reviewSchema } = require('./schema')
const Review = require("./models/review")

const MONGO_URL = "mongodb://localhost:27017/wanderlust"

main().then(() => {

  console.log("Connected to DB")
}).catch((err) => {
  console.log(err)
})



async function main() {
  await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


app.get('/', (req, res) => {
  res.send("Hi, I am root")
})

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, errMsg)
  }
  else
    next();

}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map(el => el.message).join(',')
    throw new ExpressError(400, errMsg)
  }
  else
    next();

}

app.get('/testlisting', async (req, res) => {
  const sampleListing = new Listing({
    title: "My new villa",
    description: "By the beach",
    price: 1200,
    location: "calangute,Goa",
    country: "India"
  })
  await sampleListing.save()
  res.send("testing successful")

})

//index route
app.get('/listings', async (req, res) => {
  const allListings = await Listing.find({})
  res.render('listings/index.ejs', { allListings })

})

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");

}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

//Reviews
//Post review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review)

  listing.reviews.push(newReview)
  await newReview.save()
  await listing.save()
  res.redirect(`/listings/${listing._id}`)
}))

//Delete review
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  res.redirect(`/listings/${id}`)
}))


app.all(/./, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err
  res.status(statusCode).render("error.ejs", { message })
  //res.status(statusCode).send(message)
})

app.listen(8080, () => {
  console.log("Server is listening to port 8080")
})