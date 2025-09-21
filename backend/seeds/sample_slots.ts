import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("slots").del();
    await knex("slot_exceptions").del();

    // Inserts seed entries
    const insertedSlots = await knex("slots").insert([
        { day_of_week: 1, start_time: "09:00:00", end_time: "11:00:00" }, // Monday
        { day_of_week: 1, start_time: "14:00:00", end_time: "16:00:00" }, // Monday second slot
        { day_of_week: 3, start_time: "10:00:00", end_time: "12:00:00" }, // Wednesday
    ])
    .returning("*");

    // Grab IDs
    const slot1 = insertedSlots[0].id;
    const slot2 = insertedSlots[1].id;

    await knex("slot_exceptions").insert([
    {
      slot_id: slot1,
      date: "2025-09-22", // Monday
      type: "edit",
      start_time: "10:30:00",
      end_time: "12:30:00",
    },
    {
      slot_id: slot2,
      date: "2025-09-22", // Monday
      type: "delete",
    },
    ]);
};
