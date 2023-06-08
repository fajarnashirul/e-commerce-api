const router = require('express').Router()
const auth = require('../middleware/auth')
const product = require('../controller/product')
const upload = require('../middleware/multer')

router.get('/', product.get)
router.get('/filter', product.getFilter)
router.get('/:id', product.getById)
router.post('/', auth.adminAuth, upload.single('product-img'), product.post)
router.delete('/:id', auth.adminAuth, product.remove)
router.put('/:id', auth.adminAuth, upload.single('product-img'), product.put)
router.put('/restock/:id', auth.adminAuth, product.restock)

module.exports = router