const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing")
const path = require("path")

const MONGO_URL = "mongodb://localhost:27017/wanderlust"

main().then(() => {

    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})



async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.get('/', (req, res) => {
    res.send("Hi, I am root")
})

app.get('/testlisting',async(req,res)=>{
    const sampleListing=new Listing({
         title:"My new villa",
         description:"By the beach",
         price:1200,
         location:"calangute,Goa",
         country:"India"
    })
    await sampleListing.save()
    res.send("testing successful")

})

app.get('/listings',async(req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index.ejs',{allListings})
    
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080")
})