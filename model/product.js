const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
 },
 description: {
   type: String,
   require: true
 },
 category: {
    type: String,
    require: true
 },
 price: {
    type: Number,
    require: true
 },
stock: {
  type: Number,
  require: true
},
product_img: {
  type: String,
  require: true
},
expired_time:{
    type: Date,
},
 cloudinary_id: {
  type: String,
  require: true
 }
 }, {
 timestamps: true
})
module.exports = mongoose.model('Product', productSchema)