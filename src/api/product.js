const cloudinary = require('cloudinary').v2;

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.src.api.validation

    const save = (req, res) => {
        const {name, price, ingredients_details, allergic_information, category_id=""} = { ...req.body }
        const id=req.params.id
        try {
            existsOrError(name, 'Nome do produto não informado')
            existsOrError(price, 'Preço do produto não informado')
            if(!id)existsOrError(category_id, 'Categoria do produto não informada')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(!!id) {
            const products={name, price, ingredients_details, allergic_information}
            app.database('products')
            .update(products)
            .where({ id: id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(console.log(err)))
        } else {
            const products={name, price, ingredients_details, allergic_information, category_id}
            app.database('products')
                .insert(products)
                .then(_ => res.status(204).send(_))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {       
           const rowsToDelete = await app.database('products')
                .where({ id: req.params.id })
                existsOrError(rowsToDelete, 'Produto não foi encontrado.')
 		if(rowsToDelete){await app.database('product_image')
            		.where({product_id:req.params.id}).del()}
         
		
		await app.database('products')
                .where({ id: req.params.id }).del()

       if(rowsToDelete)cloudinary.api.delete_resources_by_prefix(`Products/${req.params.id}`, 
                function(error, result) {console.log(result, error); })
                res.status(204).send()
            } catch(msg) {
                res.status(500).send(console.log(msg))
            }
    }

    const limit = 13 // usado para paginação
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.database('products').count('id').first()
        const count = parseInt(result.count)

        app.database('products')
            .limit(limit).offset(page * limit - limit)
            .then(products => res.json({ data: products, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.database('products')
            .where({ id: req.params.id })
            .first()
            .then(product =>res.json(product))
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const page = req.query.page || 1

        app.database('categories')
        .select('p.id','p.name', 'p.price', 'p.ingredients_details', 'p.allergic_information','i.url', {imageId:'i.id', title: 'c.title', subtitle:'c.subtitle', categoryId:'c.id' })
        .limit(limit).offset(page * limit - limit)
        .from({c:'categories'})
        .leftJoin({p:'products'},'p.category_id','c.id')
        .leftJoin({i:'product_image'},'i.product_id','p.id')
        .where({category_id:req.params.id})
        .orderBy('p.id', 'cres')
        .then(products => res.json(products))
        .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}