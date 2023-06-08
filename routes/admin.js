const router = require('express').Router()
const auth = require('../middleware/auth')
const admin = require('../controller/admin')

router.post('/login', admin.login)
router.get('/me', auth.adminAuth, admin.getMe)
router.post('/logout', auth.adminAuth, admin.logout)
router.put('/me', auth.adminAuth, admin.editProfile)

module.exports = router