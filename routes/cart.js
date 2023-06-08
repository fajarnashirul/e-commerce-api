const router = require('express').Router()
const cart = require('../controller/cart')
const auth = require('../middleware/auth')

router.get('/', auth.userAuth, cart.get)
router.post('/', auth.userAuth, cart.post)
router.delete('/product/:id', auth.userAuth, cart.deleteProduct)

module.exports = router