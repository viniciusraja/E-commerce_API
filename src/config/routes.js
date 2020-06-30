const multer = require('multer')
const multerConfig=require('./multer')
const admin = require('./admin')
module.exports=app=>{
    app.post('/signup', app.src.api.user.save)
    app.post('/signin', app.src.api.authentication.signin)
    app.post('/validateToken', app.src.api.authentication.validateToken)

    app.route('/users')
        .all(app.src.config.passport.authenticate())
        .post(app.src.api.user.save)
        .get(app.src.api.user.get)
        
        app.route('/users/:id')
        .all(app.src.config.passport.authenticate())
        .put(admin(app.src.api.user.save))
        .get(admin(app.src.api.user.getById))
        .delete(app.src.api.user.remove)
        
        app.route('/users/:id/adress')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.adress.getByUser)
        
        app.route('/adress')
        .all(app.src.config.passport.authenticate())
        .post(app.src.api.adress.save)
        
        app.route('/adress/:id')
        .all(app.src.config.passport.authenticate())
        .put(app.src.api.adress.save)
        .delete(app.src.api.adress.remove)
        
        app.route('/categories')
        .get(app.src.api.productsCategory.get)
        .all(app.src.config.passport.authenticate())
        .post(app.src.api.productsCategory.save)
        
        app.route('/categories/:id')
        .put(app.src.api.productsCategory.save)
        .delete(app.src.api.productsCategory.remove)
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.productsCategory.getById)
        
        app.route('/categories/:id/products')
        .get(app.src.api.product.getByCategory)
        // .all(app.src.config.passport.authenticate())
        
        app.route('/products')
        .all(app.src.config.passport.authenticate())
        .post(admin(app.src.api.product.save))
        .get(admin(app.src.api.product.get))
        
        app.route('/products/:id')
        .all(app.src.config.passport.authenticate())
        .get(app.src.api.product.getById)
        .put(app.src.api.product.save)
        .delete(app.src.api.product.remove)
        
        app.route('/products/:id/image')
 	.all(app.src.config.passport.authenticate())
        .post(multer(multerConfig).single("file"),app.src.api.productImage.save)
        .put(multer(multerConfig).single("file"),app.src.api.productImage.save)
        .get(app.src.api.productImage.getByProduct)
        .delete(app.src.api.productImage.remove)
       
        
        
        
    }