const app = require('express')()
const consign = require('consign')
const database = require('./src/config/database')
app.database = database
consign()
    .include('./src/config/passport.js')
    .then('./src/config/middlewares.js')
    .then('./src/api/validation.js')
    .then('./src/api')
    .then('./src/config/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando... na porta 4000')
})