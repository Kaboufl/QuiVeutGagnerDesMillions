import knex from "knex";

// Configuration de la connexion à la base de données
export const db = knex({
    client: 'mysql2',
    connection: {
        host: 'db',
        port: 3306,
        user: "user",
        password: "password",
        database: "mydatabase"
    }
})