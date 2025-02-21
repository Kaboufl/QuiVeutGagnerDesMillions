import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('questions', (table) => {
        table.increments('id').primary();
        table.text('question').notNullable();
        table.string('answer1').notNullable();
        table.string('answer2').notNullable();
        table.string('answer3').notNullable();
        table.string('answer4').notNullable();
        table.integer('correct_answer').notNullable().checkBetween([1, 4]); // Valeur entre 1 et 4
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('questions');
}
