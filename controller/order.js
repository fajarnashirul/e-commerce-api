const order = require('../service/order')
const cart = require('../service/cart')
const user = require('../service/user')
const product = require('../service/product')

const get = async (req, res, next) => {
    try{
        const data = await order.get({owner: req.user.id})
        if (!data || data.length === 0) {
            res.status(404).send({message: 'order is empty'})
        }
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const checkout = async (req, res, next) => {
    try{
        const userCart = await cart.get({owner: req.user.id})
        if (!userCart || userCart.length === 0) {
            res.status(404).send({message: 'cart is empty'})
        }
        const userData = await user.getMe(req.user.id)
        if (!userData || userData.length === 0) {
            res.status(404).send({message: 'user cannot be found'})
        }
        const outOfStock = await product.checkStock(userCart)
        if(outOfStock){
            res.status(400).send({message: "product out of stock"})
        }
        else {
            const data = await order.checkout({body: req.body}, userCart, userData)
            await product.updateStock(userCart.products, 'pending')
            res.status(200).send(data)
        }
        
    }catch (error){
        console.log(error)
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try{
        const data = await order.getAll()
    if (!data || data.length === 0) {
        res.status(404).send({message: 'Product Empty'})
    }
    res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}
const getFilter = async (req, res, next) => {
    const query = {
        $or: [
            { "owner.name": { $regex: req.query.name, $options: 'i' } },
            { "owner.email": { $regex: req.query.email, $options: 'i' } }
        ],
      }
    try{
        const data = await order.getSearch(query)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Data cannot be found'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const remove = async (req, res, next) => {
    try{
        await order.remove(req.params.id)
        res.status(200).send({message: 'order removed'})  
    }catch (error){
        console.log(error)
        next(error)
    }
}

module.exports = {
    get,
    checkout,
    getAll,
    getFilter,
    remove,
}

