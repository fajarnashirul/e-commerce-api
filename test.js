// const {SignJWT, KeyObject} = require('jose')
const jose = require('jose')
const fs = require('fs')
const express = require('express')
const app = express()
// const jwt = require('jsonwebtoken')
require('dotenv').config()

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message)
})

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// const publicKey = fs.readFileSync('public.pem')
// const alg = 'EdDSA'
// const pkcs8 = (fs.readFileSync('private.pem')).toString()


// const generateToken = async () => {
//     try {
//     //   const privateKey = fs.readFileSync('private.pem');
//     const privateKey = await jose.importPKCS8(pkcs8, alg)
//       const jwt = await new jose.SignJWT({ 'urn:example:claim': true })
//         .setProtectedHeader({ alg })
//         .setIssuedAt()
//         .setIssuer('urn:example:issuer')
//         .setAudience('urn:example:audience')
//         .setExpirationTime('1h')
//         .sign(privateKey);
  
//       console.log(jwt);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   generateToken();

async function generateToken(user) {

    const pkcs8 = (fs.readFileSync('private.pem')).toString()
    const privateKey = await jose.importPKCS8(pkcs8, {alg: 'EdDSA'})

    const jwt = await new jose.SignJWT(user)
    .setProtectedHeader({alg: 'EdDSA'})
    .setIssuedAt()
    .setSubject(user)
    .setExpirationTime('1h')
    .sign(privateKey)

    return jwt
}

async function userAuth(token) {
    const spki = (fs.readFileSync('public.pem')).toString()
    const publicKey = await jose.importSPKI(spki, {alg: 'EdDSA'})

    const {payload, ProtectedHeader} = await jose.jwtVerify(token, publicKey, {alg: 'EdDSA'})
    // console.log(payload)
    // console.log(ProtectedHeader)
    return payload
}

app.post('/login', async (req, res) => {
    const user = req.body
    // const user = { name: name }
    const token = await generateToken(user)
    res.send({ token })
})

app.post('/verif', async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const payload = await userAuth(token)
    res.send(payload)
})

app.listen(process.env.PORT || 8080, function () {
    console.log('App running on port ' + process.env.PORT)
})