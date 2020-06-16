const multer = require('multer')
const multerConfig=require('./multer')
module.exports=app=>{
    app.post('/signup', app.src.api.user.save)
    // app.post('/signin', app.src.api.auth.signin)
    // app.post('/validateToken', app.src.api.auth.validateToken)

    app.route('/users')
        // .all(app.config.passport.authenticate())
        .post(app.src.api.user.save)
        .get(app.src.api.user.get)
        
        app.route('/users/:id')
        //     .all(app.config.passport.authenticate())
        .put(app.src.api.user.save)
        .get(app.src.api.user.getById)
        .delete(app.src.api.user.remove)
        
        app.route('/users/:id/adress')
        .get(app.src.api.adress.getByUser)
        
    app.route('/adress')
        .post(app.src.api.adress.save)
        
        app.route('/adress/:id')
        .put(app.src.api.adress.save)
        .delete(app.src.api.adress.remove)

    app.route('/categories')
        .post(app.src.api.productsCategory.save)
        .get(app.src.api.productsCategory.get)
        
        app.route('/categories/:id')
        .put(app.src.api.productsCategory.save)
        .get(app.src.api.productsCategory.getById)
        .delete(app.src.api.productsCategory.remove)

        app.route('/categories/:id/products')
        .get(app.src.api.product.getByCategory)
    
    app.route('/products')
    //     .all(app.config.passport.authenticate())
    //     .put(admin(app.src.api.user.save))
    .post(app.src.api.product.save)
    .get(app.src.api.product.get)
    //     .delete(admin(app.src.api.user.remove))
        app.route('/products/:id')
        .get(app.src.api.product.getById)
        .put(app.src.api.product.save)
        .delete(app.src.api.product.remove)
        
        app.route('/products/:id/image')
        .post(multer(multerConfig).single('file'),app.src.api.productImage.save)
        .put(multer(multerConfig).single('file'),app.src.api.productImage.save)
        .get(app.src.api.productImage.getByProduct)
        
        app.route('/image/:id')
        .delete(app.src.api.productImage.remove)

    }