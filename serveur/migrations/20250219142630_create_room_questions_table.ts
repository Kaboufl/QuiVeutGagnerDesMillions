import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('room_questions', (table) => {
        table.increments('id').primary();
        table.string('room_id').notNullable().references('room_id').inTable('rooms').onDelete('CASCADE');
        table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('room_questions');
}
