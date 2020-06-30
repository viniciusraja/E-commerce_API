// Update with your config settings.

module.exports = {
    client: 'postgresql',
    connection:{
      database: DB_NAME,
      user:     'postgres',
      password: POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
