import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: "user",
        password: "password",
        database: "mydatabase"
    }
  },

  staging: {
    client: 'mysql',
    connection: {
        host: 'db',
        port: 3306,
        user: "user",
        password: "password",
        database: "mydatabase"
    }
  },

  production: {
    client: 'mysql',
    connection: {
        host: 'db',
        port: 3306,
        user: "user",
        password: "password",
        database: "mydatabase"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
