const webhook = require('../service/webhook')

const post = async (req, res, next) => {
    try{
        const isValid = await webhook.verif({body: req.body})
        if (isValid) {
            await webhook.config({body: req.body})
            console.log(req.body)
            res.status(200)
        } else {
            res.status(400)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {
    post,
}