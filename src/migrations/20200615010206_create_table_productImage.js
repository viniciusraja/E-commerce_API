  exports.up = function(knex) {
    return knex.schema.createTable('product_image', table=>{
        table.increments('id').primary()
        table.integer('product_id').references('id')
              .inTable('products').notNull().unique()
        table.string('name').notNull()
        table.decimal('size').notNull()
        table.string('url',1000).notNull()
        table.datetime('created_at',{useTz:false}, {precision: 0}).defaultTo(knex.fn.now(0))
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('product_image')
    
  };
  