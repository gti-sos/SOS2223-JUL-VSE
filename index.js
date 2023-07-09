var express = require("express");
var cool = require("cool-ascii-faces");

var app = express();
var port = process.env.PORT || 12345;

app.use("/",express.static("./public"))

app.listen(port, ()=>{
    console.log(`Server ready in port ${port}`);
});