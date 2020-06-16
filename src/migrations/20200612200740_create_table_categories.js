exports.up = function(knex) {
  return knex.schema.createTable('categories', table=>{
      table.increments('id').primary()
      table.string('title').notNull()
      table.string('subtitle')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories')
  
};
