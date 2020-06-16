const multer = require('multer')
const multerConfig=require('../config/multer')
module.exports = app => {
    const { existsOrError,notExistsOrError } = app.src.api.validation
    const save = async (req, res) => {
        const {originalname:name, size,key, path:url=''}={...req.file}
        const product_id =parseInt(req.params.id)
        const productImg = { name,size,key,url, product_id}
        const productExists= await app.database('products')
        .where({id:productImg.product_id}).first()
        const productImageFromDB = await app.database('product_image')
        .where({ product_id:productImg.product_id}).first()
        
        try {
            if(req.method=='POST'){notExistsOrError(productImageFromDB, 'Imagem já foi cadastrada.')}
            if(req.method=='PUT'){existsOrError(productImageFromDB, 'Imagem não pode ser atualizada, pois não foi cadastrada.')}
            existsOrError(productExists, 'Produto não foi encontrado para adicionar imagem.')
            existsOrError(productImg.name, 'Nome da Imagem não informado')
            existsOrError(productImg.size, 'Tamanho da Imagem não informado')
            existsOrError(productImg.key, 'Key da Imagem não informado')
            existsOrError(productImg.url, 'Url da Imagem não informado')
            existsOrError(productImg.product_id, 'Produto da Imagem não informado')
            
            if(req.method=='PUT') {
                
                console.log('update')
                app.database('product_image')
                .update(productImg)
                .where({ product_id: productImg.product_id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
            } else {
                console.log('insert')
                app.database('product_image')
                .insert(productImg)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
            }
        } catch(msg) {
            res.status(400).send(`Erro:${msg}`)
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.database('product_image')
                .where({ id: req.params.id }).del()
                existsOrError(rowsDeleted, 'Imagem não foi encontrado.')
                res.status(204).send()
            } catch(msg) {
                res.status(500).send(msg)
            }
    }


    const getByProduct = async (req, res) => {
        app.database({i:'product_image', p: 'products'})
            .select('p.id','p.name', 'p.price', 'p.ingredients_details', 'p.allergic_information', { url: 'i.url', imgId:'i.id'})
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['i.product_id','p.id'])
            .where({product_id:req.params.id})
            .orderBy('i.id', 'cres')
            .then(productImg => res.json(productImg))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, getByProduct}
}