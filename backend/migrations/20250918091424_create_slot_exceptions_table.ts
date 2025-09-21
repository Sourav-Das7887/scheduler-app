import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("slot_exceptions", (table) => {
    table.increments("id").primary();
    table.integer("slot_id").unsigned().notNullable().references("id").inTable("slots").onDelete("CASCADE");
    table.date("date").notNullable();
    table.time("start_time").nullable();
    table.time("end_time").nullable();
    table.string("type").notNullable(); // 'edit' or 'delete'
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("slot_exceptions");
}
