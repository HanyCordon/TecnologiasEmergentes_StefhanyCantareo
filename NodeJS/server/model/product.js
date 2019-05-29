var mongoose = require("mongoose");

var productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  urlImage : String,
  description: String,
  price: Number,
  quantity: Number
});
  
var Product = mongoose.model("Product", productSchema);

module.exports = Product;
