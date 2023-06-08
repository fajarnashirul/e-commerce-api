const router = require('express').Router()
const webhook = require('../controller/webhook')

router.post('/webhook', webhook.post)

module.exports = router
