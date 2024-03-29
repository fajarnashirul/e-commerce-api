const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const webhookRoute = require('./routes/webhook')
require('dotenv').config()

try {
    mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log('connected to db')
  } catch (error) {
    handleError(error)
  }

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message)
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(
  cors({
    origin: "*",
  })
);

app.use('/user', userRoute)
app.use('/admin', adminRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)
app.use('/order', orderRoute)
app.use('/', webhookRoute)

app.listen(process.env.PORT || 8080, function () {
    console.log('App running on port ' + process.env.PORT)
})

