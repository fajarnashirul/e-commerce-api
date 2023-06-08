const admin = require('../service/admin')

const login = async (req, res, next) => {
    try{
        const data = await admin.login({body: req.body})
        if (!data){
            return res.status(401).send({message: 'Cannot login'})
        }
        return res.status(200).send({token: data})
    }catch (error){
        console.log(error)
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try{
        const data = await admin.getMe(req.admin.id)
        if (!data || data.length === 0){
            return res.status(404).send({message: 'Data cannot be found'})
        }
        return res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const logout = async (req, res, next) => {
    try{
        await admin.logout(req.admin.id)
        return res.status(200).send({message: 'Logout'})
    }catch (error){
        console.log(error)
        next(error)
    }
}

const editProfile = async (req, res, next) => {
    try{
        const data = await admin.editProfile({body: req.body}, req.admin.id)
        if (!data || data.length === 0){
            return res.status(404).send({message: 'Data cannot be found'})
        }
        return res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

module.exports = {
    login,
    getMe,
    logout,
    editProfile,
}