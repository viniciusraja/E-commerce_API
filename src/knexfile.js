// Update with your config settings.
require("dotenv").config();
module.exports = {
    client: 'postgresql',
    connection:{
      database: 'dinershop_db',
      user:     'postgres',
      password: '1235813'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
