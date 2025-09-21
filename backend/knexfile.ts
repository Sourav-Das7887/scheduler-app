
import type { Knex } from 'knex';

const config: {[key: string]: Knex.Config} = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST || "127.0.0.1",
            port:  Number(process.env.DB_PORT || 5432),
            user: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "1234",
            database: process.env.DB_NAME || "scheduler_db",
        },
        migrations: {
            directory: "./migrations",
        },
        seeds: {
            directory: "./seeds",
        },
    },
};

export default config;