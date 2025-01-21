import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('rooms', (table) => {
        table.string('room_id').primary();
    })
}


export async function down(knex: Knex): Promise<void> {
}

