const { findById } = require('../model/order')
const User = require('../model/user')

const register = async({body}) => {
    const { name, email, password, phone } = body
    const user = new User({
        name,
        email,
        password,
        phone
    })
    await user.save()
    return user
}

const login = async({body}) => {
    const { email, password } = body
    const user = await User.findByCredentials({email}, {password})
    const token = await user.generateAuthToken()
    return token
}

const getMe = async(id) => {
    const user = await User.findById(id)
    return user
}

const editProfile = async({body}, id) => {
    const { name, phone } = body
    let user = await User.findById(id)
    if (!user) return 
    const update = {
        name: name || user.name,
        phone: phone || user.phone
    }
    user = await User.findByIdAndUpdate(id, update, {
        new: true
    })
    return user
}

module.exports = {
    register, 
    login,
    getMe,
    editProfile,
}