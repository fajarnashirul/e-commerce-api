const router = require('express').Router()
const Auth = require('./auth')

router.post('/sign', async (req, res) => {
    try {
        const user = req.body
        const token = await Auth.generateToken(user)
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/verif', Auth.userAuth, async (req, res) => {
    try {
        const decode = req.user
        res.status(200).send({ decode })
    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router