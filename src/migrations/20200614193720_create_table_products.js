  exports.up = function(knex) {
    return knex.schema.createTable('products', table=>{
        table.increments('id').primary()
        table.integer('category_id').references('id')
              .inTable('categories').notNull()
        table.string('name').notNull()
        table.string('price').notNull()
        table.string('ingredients_details')
        table.string('allergic_information')
        
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('products')
    
  };
  