const product = require('../service/product')

const get = async (req, res, next) => {
    const search = {$or: [{name: {$regex: req.query.name, $options: 'i'}}]}
    try{
        const data = await product.get(search)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Data cannot be found'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const getById = async (req, res, next) => {
    try{
        const data = await product.getById(req.params.id)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Data cannot be found'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const getFilter = async (req, res, next) => {
    const query = {
        $and: [
          { name: { $regex: req.query.name, $options: 'i' } },
          { price: { $gte: req.query.priceMin, $lte: req.query.priceMax } },
          { category: { $regex: req.query.category, $options: 'i' } },
        ],
      }
    try{
        const data = await product.get(query)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Data cannot be found'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const post = async (req, res, next) => {
    try{
        const data = await product.post({body: req.body}, req.file.path)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Product cannot be save'})
        } 
        res.status(200).send(data)
    }catch (error){
        console.log(error)
        next(error)
    }
}

const remove = async (req, res, next) => {
    try{
        await product.remove(req.params.id)
        res.status(200).send({message: 'product deleted'})
    }catch (error){
        console.log(error)
        next(error)
    }
}

const put = async (req, res, next) => {
    try{
        const data = await product.put(req.params.id, {body: req.body}, req.file.path)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Product cannot be edit'})
        }
        res.status(200).send(data) 
    }catch (error){
        console.log(error)
        next(error)
    }
}
const restock = async(req, res, next) => {
    try{
        const data = await product.restock(req.params.id, req.body.quantity)
        if (!data || data.length === 0) {
            res.status(404).send({message: 'Product cannot be restock'})
        }
        res.status(200).send(data) 
    }catch (error){
        console.log(error)
        next(error)
    }
}
module.exports = {
    get,
    getById,
    getFilter,
    post,
    remove,
    put,
    restock,
}