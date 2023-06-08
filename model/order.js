const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    owner : {
        ownerId: {
            type: ObjectID,
            required: true,
            ref: 'User'
        },
        name: String,
        phone: String,
        email: String
       },
    address: {
        type: String,
        require: true
    },
    products: [{
        productId: {
         type: ObjectID,
         ref: 'Product',
         required: true
      },
      name: String,
      quantity: {
         type: Number,
         required: true,
         min: 1,
         default: 1},
         price: Number
       }],
    description: {
        type: String
    },
    payment_status: {
        type: String,
        require: true
    },
    payment_link: {
        type: String
    },
    bill: {
        type: Number,
        required: true,
        default: 0
        },
      }, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)