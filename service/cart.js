const Cart = require('../model/cart')

const get = async({owner}) => {
    const cart = await Cart.findOne({owner})
    if (cart && cart.products.length > 0) return cart
    return 
}

const post = async(product, {owner}, quantity ) => {
    const productId = product.id
    const price = product.price
    const name = product.name
    const product_img = product.product_img

    const cart = await Cart.findOne({owner})
    //check if cart already exist
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.productId == productId)
        //check product
        if (productIndex > -1) {
            let item = cart.products[productIndex]
            item.quantity += parseInt(quantity)
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price
            }, 0)
            cart.products[productIndex] = item
            await cart.save()
            return cart
        } else {
            cart.products.push({ productId, name, quantity, price, product_img })
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price
            }, 0)
            await cart.save()
        }
        return cart
    } else {
        //no cart exists
        const newCart =  Cart.create({
            owner,
            products: [{ productId, name, quantity, price, product_img }],
            bill: quantity * price,
        })
        return newCart
    }
}

const deleteProduct = async(cart, productId) => {
    const productIndex = cart.products.findIndex((product) => product.productId == productId)
      
      if (productIndex > -1) {
        const product = cart.products[productIndex]
        cart.bill -= product.quantity * product.price
        if(cart.bill < 0) {
            cart.bill = 0
        } 
        cart.products.splice(productIndex, 1)
        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price
      },0)
        await cart.save()
        return cart
    }
    return
}
module.exports = {
    get,
    post,
    deleteProduct,
}