import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("slots", (table) => {
    table.increments("id").primary();
    table.integer("day_of_week").notNullable(); // 0 = Sunday
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("slots");
}
