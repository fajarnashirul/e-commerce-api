const midtransClient = require('midtrans-client')
require('dotenv').config()

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
})

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  })

const createTransaction = async (parameter) => {
    const charge = await core.charge(parameter)
    return charge
}

// const createTransaction = async (parameter) => {
//     const paymentResponse = await snap.createTransaction(parameter)
//     const paymentUrl = paymentResponse.redirect_url;
//     return paymentUrl
// }

const statusTransaction = async (orderId) => {
    const status = await core.transaction.status(orderId)
    return status
}

const cancelTransaction = async (orderId) => {
  const response = await core.transaction.cancel(orderId);
  return response
}

// const createTransaction = async (parameter) => {
//     const redirectUrl = snap.createTransactionRedirectUrl(parameter)
//     return redirectUrl
// }

// const statusTransaction = async (orderId) => {
//     const status = snap.transaction.status(orderId)
//     return status
// }
module.exports = {
    createTransaction,
    statusTransaction,
    cancelTransaction,
}