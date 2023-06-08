const router = require('express').Router()
const auth = require('../middleware/auth')
const user = require('../controller/user')

router.post('/register', user.register)
router.post('/login', user.login)
router.get('/me', auth.userAuth, user.getMe)
router.post('/logout', user.logout)
router.put('/me', auth.userAuth, user.editProfile)

module.exports = router