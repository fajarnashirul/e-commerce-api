const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
require('dotenv').config()

const userSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        require: true
    },
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await auth.generateToken(user._id)
    return token
}

userSchema.pre('save', async function(next) {
    const user = this
       if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8)
    }
      next()
})

userSchema.statics.findByCredentials = async ({email}, {password}) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User