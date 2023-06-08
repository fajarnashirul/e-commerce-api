const Product = require('../model/product')
const cloudinary = require('../utils/cloudinary')

const get = async (search) => {
    const product = await Product.find(search)
    if(product) return product
    return null
}

const getById = async (id) => {
    const product = await Product.findById(id)
    return product
}

const post = async ({body}, path) => {
    const result = await cloudinary.uploader.upload(path)
    const product = new Product({
        ...body,
        product_img: result.secure_url,
        cloudinary_id: result.public_id
    })
    await product.save()
    return product
}

const remove = async (id) => {
    const product = await Product.findById(id)
    await cloudinary.uploader.destroy(product.cloudinary_id)
    await product.deleteOne()
    return
}

const put = async (id, {body}, path) => {
    const { name, description, category, stock, price, expired_date } = body
    let product = await Product.findById(id)
    await cloudinary.uploader.destroy(product.cloudinary_id)
    const result = await cloudinary.uploader.upload(path)
    const update = {
        name: name || product.name,
        description: description || product.description,
        category: category || product.category, 
        stock: stock || product.stock,
        price: price || product.price,
        expired_date: expired_date || product.price,
        product_img: result.secure_url || product.product_img,
        cloudinary_id: result.public_id || product.cloudinary_id
    }

    product = await Product.findByIdAndUpdate(id, update, {
        new: true
    })
    return product
}
const restock = async (id, quantity) => {
    const update = {stock: quantity}
    await Product.findByIdAndUpdate(id, update, {
        new: true
    })
    return {message: 'stock updated'}
}

const checkStock = async (cart) => {
    let outOfStock = false
    for (let index = 0; index < cart.products.length; index++) {
        const productCart = cart.products[index]
        const product = await Product.findById(productCart.productId)
        if (product.stock === 0 || product.stock < productCart.quantity) {
            outOfStock = true
        }
    }
    return outOfStock
}
const updateStock = async (products, status) => {
    if (status == 'cancel' || status == 'expire' || status == 'deny') {
        for (let index = 0; index < products.length; index++) {
            const productOrder = products[index]
            const product = await Product.findById(productOrder.productId)
            const stock = parseInt(product.stock) + parseInt(productOrder.quantity)
            await restock(productOrder.productId, stock)
        }
    } else if (status == 'pending') {
        for (let index = 0; index < products.length; index++) {
            const productOrder = products[index]
            const product = await Product.findById(productOrder.productId)
            const stock = parseInt(product.stock) - parseInt(productOrder.quantity)
            await restock(productOrder.productId, stock)
        }
    }
}

module.exports = {
    get,
    getById,
    post,
    remove,
    put,
    restock,
    checkStock,
    updateStock,
}