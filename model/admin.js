const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jose = require('jose')
const fs = require('fs')
// const auth = require('../auth')
require('dotenv').config()

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('password must not contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, {
    timestamps: true
})

adminSchema.methods.generateAuthToken = async function () {

    //cannot use auth.generateToken IDK why
    const admin = this
    const alg = 'EdDSA'
    const pkcs8 = (fs.readFileSync('private.pem')).toString()
    const privateKey = await jose.importPKCS8(pkcs8, alg)

    const token = await new jose.SignJWT({id: admin._id})
    .setProtectedHeader({alg})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey)
    // const token = await auth.generateToken(admin._id)
    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token
}

adminSchema.pre('save', async function(next) {
    const admin = this
       if (admin.isModified('password')) {
       admin.password = await bcrypt.hash(admin.password, 8)
    }
      next()
})

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return admin
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin