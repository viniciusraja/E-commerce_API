exports.up = function(knex) {
    return knex.schema.createTable('adress', table=>{
        table.increments('id').primary()
        table.integer('user_id').references('id')
            .inTable('users').notNull()
        table.string('CEP').notNull()
        table.string('street').notNull()
        table.string('number').notNull()
        table.string('complement',300)
        table.string('reference',300)
        
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('adress')
    
  };
  