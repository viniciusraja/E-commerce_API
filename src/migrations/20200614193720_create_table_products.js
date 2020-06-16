  exports.up = function(knex) {
    return knex.schema.createTable('products', table=>{
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('price').notNull()
        table.string('ingredients_details')
        table.string('allergic_information')
        table.integer('category_id').references('id')
              .inTable('categories').notNull()
        
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('products')
    
  };
  