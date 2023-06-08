const router = require('express').Router()
const order = require('../controller/order')
const auth = require('../middleware/auth')

router.get('/user', auth.userAuth, order.get)
router.post('/checkout', auth.userAuth, order.checkout)
router.get('/all', auth.adminAuth, order.getAll)
router.get('/filter', auth.adminAuth, order.getFilter)
router.delete('/', auth.adminAuth, order.remove)

module.exports = router