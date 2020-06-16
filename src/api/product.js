const productImage = require("./productImage")

module.exports = app => {
    const { existsOrError } = app.src.api.validation

    const save = (req, res) => {
        const product = { ...req.body }
        if(req.params.id) product.id = req.params.id

        try {
            existsOrError(product.name, 'Nome do produto não informado')
            existsOrError(product.price, 'Preço do produto não informado')
            existsOrError(product.category_id, 'Categoria do produto não informada')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(product.id) {
            app.database('products')
                .update(product)
                .where({ id: product.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.database('products')
                .insert(product)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const productsImage= await app.database('product_image')
            .where({product_id:req.params.id}).del()
            console.log(productsImage)
            const rowsDeleted = await app.database('products')
                .where({ id: req.params.id }).del()
                notExistsOrError(rowsDeleted, 'Produto não foi encontrado.')
                res.status(204).send()
            } catch(msg) {
                res.status(500).send(msg)
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