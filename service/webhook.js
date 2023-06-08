require('dotenv').config()
const order = require('../service/order')
const product = require('../service/product')
const crypto = require('crypto')

const verif = async ({body}) => {
    const { order_id, status_code, gross_amount, signature_key } = body
    const hashString = order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
    const hash = crypto.createHash('sha512').update(hashString).digest('hex')

    return hash === signature_key
}
const config = async ({body}) => {
    const {order_id, transaction_status } = body
    await order.updatePaymentStatus(order_id, transaction_status)
    if (transaction_status == 'cancel' || transaction_status == 'expire' || transaction_status == 'deny') {
        const UserOrder = await order.getById(order_id)
        await product.updateStock(UserOrder.products, transaction_status)
    }
    return
}
module.exports = {
    verif,
    config,
}