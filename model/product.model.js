const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
     isOffer: {
          type: Boolean,
     },
     newProduct: {
          type: Boolean,
     },
     name: {
          type: String, 
          required: [true, "Please enter product name"],
          trim: true,
     },
     brand: {
          type: String,
          required: [true, "Please enter Brand name"],
          trim: true,
     },
     description: {
          type: String,
          required: [true, "please enter product description"],
     },
     price: {
          type: Number,
          required: [true, "Please enter product"],
          maxlength: [7, "Price cannot exceed 7 characters"],
     },
     rating: { type: Number, default: 0 },
     images: [{ type: String, required: true }],
     like:{ type: Number, default: 0 },
     category: {
          type: String,
          required: [true, "Please enter product Category"],
     },
     qnty: {
          type: Number,
          required: [true, "Please enter product Stock"],
          maxlength: [7, "Price cannot exceed 7 characters"],
          default: 1,
     },
     ratingCount: { type: Number, default: 0 },
     strikedprice: { type: Number, default: 20 },
     createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = { ProductModel };