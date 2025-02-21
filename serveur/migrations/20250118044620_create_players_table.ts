import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('players', (table) => {
        table.increments('id').primary();
        table.string('user_identifier').notNullable();
        table.string('username').notNullable();
        table.string('room_id').notNullable();
        table.boolean('is_master').defaultTo(false);
        table.foreign('room_id').references('room_id').inTable('rooms');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('players');
}

