import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable('rooms', table => {
            table.integer('master_id').unsigned().references('id').inTable('players');
        })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .alterTable('rooms', table => {
            table.dropForeign('master_id');
            table.dropColumn('master_id');
        })
}

