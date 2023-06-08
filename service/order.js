const Order = require('../model/order')
const Cart = require ('../model/cart')
const midtrans = require('../utils/midtrans')

const get = async({owner}) => {
    const order = await Order.find({'owner.ownerId': {$eq: owner}})
    return order
}

const getAll = async() => {
    const order = await Order.find()
    return order
}

const getById = async(id) => {
    const order = await Order.findById(id)
    return order
}

const getSearch = async({search}) => {
    const order = await Order.find(search)
    return order
}

const checkout = async({body}, cart, user) => {
    const { description, address } = body
    const ownerId = user.id
    const name = user.name
    const email = user.email
    const phone = user.phone
    const order = new Order({
        owner: {
            ownerId,
            name,
            phone,
            email
        },
        address: address,
        products: cart.products,
        description: description,
        payment_status: 'pending',
        bill: cart.bill
    })
    const parameter = {
        payment_type: "gopay",
        transaction_details: {
        gross_amount: order.bill,
        order_id: order.id,
        email: email
    },
        gopay: {
        enable_callback: true,                // optional
        callback_url: "someapps://callback"   // optional
    }
        // payment_type: 'gopay',
        // transaction_details: {
        //   order_id: order.id,
        //   gross_amount: order.bill,
        //   item_details: order.products,
        //   customer_details: {
        //     first_name: name,
        //     last_name: name,
        //     email: email,
        //     phone: phone,
        //     billing_address: {
        //         first_name: name,
        //         last_name: name,
        //         address: address
        //     }
        // },
        // expiry: {
        //     unit: 'minutes',
        //     duration: 60
        //   }
        // },
        // credit_card: {
        //     secure: true
        // },
        // callbacks: {
        //     "finish": "https://demo.midtrans.com"
        // }
    }
    try {
        const paymentUrl = await midtrans.createTransaction(parameter)
    if (paymentUrl){
        order.payment_link = paymentUrl.actions[1].url
        await order.save()
        await Cart.findByIdAndRemove(cart.id)
        return paymentUrl
    }
    } catch (error){
        console.log(error)
        throw new Error('Error creating transaction');
    }
}

const remove = async(id) => {
    const order = await Order.findByIdAndDelete(id)
    return order
}

const updatePaymentStatus = async(id, status) => {
    const update = {
        payment_status: status
    }
    await Order.findByIdAndUpdate(id, update, {
        new: true,
      })
}
module.exports = {
    get,
    checkout,
    getAll,
    getById,
    getSearch,
    remove,
    updatePaymentStatus,
}