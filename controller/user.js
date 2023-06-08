const user = require('../service/user')

const register = async (req, res, next) => {
    try{
        const data = await user.register({body: req.body})
        if (!data || data.length === 0){
            return res.status(404).send({message: 'Data cannot be saved'})
        }
        return res.status(200).send({name: data.name, email: data.email})
    }catch (error){
        console.log(error)
        next(error)
    }
}

const login = async (req, res, next) => {
    try{
        const data = await user.login({body: req.body})
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
        const data = await user.getMe(req.user.id)
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
        return res.status(200).send({message: 'Logout'})
    }catch (error){
        console.log(error)
        next(error)
    }
}

const editProfile = async (req, res, next) => {
    try{
        const data = await user.editProfile({body: req.body}, req.user.id)
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
    register,
    login,
    getMe,
    logout,
    editProfile,
}