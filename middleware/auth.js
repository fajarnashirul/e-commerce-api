const jose = require('jose')
const fs = require('fs')
const Admin = require('../model/admin')


const alg = 'EdDSA'
async function generateToken(id) {

    const pkcs8 = (fs.readFileSync('private.pem')).toString()
    const privateKey = await jose.importPKCS8(pkcs8, alg)

    const token = await new jose.SignJWT({id: id})
    .setProtectedHeader({alg})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey)

    return token
}


const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const spki = (fs.readFileSync('public.pem')).toString()
        const publicKey = await jose.importSPKI(spki, alg)

        const {payload, ProtectedHeader} = await jose.jwtVerify(token, publicKey, {algorithms: [alg]})
        req.user = payload
        next()
    } catch {
        res.status(401).send({error: "Authentication required"})
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const spki = (fs.readFileSync('public.pem')).toString()
        const publicKey = await jose.importSPKI(spki, alg)

        const {payload, ProtectedHeader} = await jose.jwtVerify(token, publicKey, {algorithms: [alg]})
        const admin = await Admin.findOne({ _id: payload.id, 'tokens.token':token })
        if(!admin) {
            throw new Error
        }
        req.admin = payload
        next()
    } catch {
        res.status(401).send({error: "Authentication required"})
    }
}

module.exports = {
    generateToken,
    userAuth,
    adminAuth,
}



