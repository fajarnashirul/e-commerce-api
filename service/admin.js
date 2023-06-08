const Admin = require('../model/admin')

const getMe = async (id) => {
    const admin = await Admin.findById(id)
    return admin
}

const login = async({body}) => {
    const { email, password } = body
    const admin = await Admin.findByCredentials(email, password)
    const token = await admin.generateAuthToken()
    return token
}

const editProfile = async({body}, id) => {
    const { name, phone } = body
    let admin = await Admin.findById(id)
    if (!admin) return 
    const update = {
        name: name || admin.name,
        phone: phone || admin.phone
    }
    admin = await Admin.findByIdAndUpdate(id, update, {
        new: true
    })
    return admin
}

const logout = async (id) => {
    const admin = await Admin.findById(id)
    admin.tokens = []
    await admin.save()
    return
}

module.exports = {
    getMe,
    login,
    editProfile,
    logout,
}