import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('questions', (table) => {
        table.increments('id').primary();
        table.text('question').notNullable();
        table.string('reponse1').notNullable();
        table.string('reponse2').notNullable();
        table.string('reponse3').notNullable();
        table.string('reponse4').notNullable();
        table.integer('bonne_reponse').notNullable().checkBetween([1, 4]); // Valeur entre 1 et 4
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('questions');
}
