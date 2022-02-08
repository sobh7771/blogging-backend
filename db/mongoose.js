const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected Successfully"))
  .catch(() => console.log("Unable to connect"));
