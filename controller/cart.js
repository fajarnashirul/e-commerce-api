const cart = require('../service/cart')
const product = require('../service/product')

const get = async (req, res, next) => {
    try{
        const data = await cart.get({owner: req.user.id})
        if (!data || data.length === 0) {
            res.status(404).send({message: 'cart empty'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const post = async (req, res, next) => {
    try{
        const { productId, quantity, } = req.body
        const userProduct = await product.getById(productId)
        if (!userProduct || userProduct.length === 0) {
            res.status(404).send({message: 'product cannot be found'})
        }else {
            const data = await cart.post(userProduct, {owner: req.user.id}, quantity)
            res.status(200).send(data)
        }
        // if (userProduct.stock === 0 || userProduct.stock < quantity){
        //     res.status(400).send({message: "product out of stock"})
        // }
        // const checkStock = await product.checkStock(productId, quantity)
        // if (checkStock){
        //     res.status(400).send({message: "product out of stock"})
        // }else{
        //     // const stock = parseInt(userProduct.stock) - parseInt(quantity)
        //     // await product.updateStock(productId, stock) 
        //     const data = await cart.post(userProduct, {owner: req.user.id}, quantity)
        //     console.log(userProduct.stock)
        //     res.status(200).send(data)
        // }
    }catch (error){
        console.log(error)
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try{
        const userCart = await cart.get({owner: req.user.id})
        const productId = req.params.id
        const data = await cart.deleteProduct(userCart, productId)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'product cannot be found'})
        }
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}
module.exports = {
    get,
    post,
    deleteProduct
}