const crypto = require('crypto')
const fs = require('fs')
const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519')

fs.writeFileSync('private.pem', privateKey.export({type: 'pkcs8', format: 'pem'}))
fs.writeFileSync('public.pem', publicKey.export({type: 'spki', format: 'pem'}))

console.log(privateKey)
console.log(publicKey)