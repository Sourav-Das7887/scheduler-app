import db from "../db";
import { SlotInput } from "../types/solt"
import dayjs from "dayjs";

export const createSlot = async (slot: SlotInput) => {
      const { day_of_week, start_time, end_time } = slot;

  const count = await db("slots")
    .where("day_of_week", day_of_week)
    .count<{ count: string }>("id as count")
    .first();

  if (Number(count?.count) >= 2) {
    throw new Error("Cannot create more than 2 slots for the same day");
  }

  const [newSlot] = await db("slots")
    .insert({ day_of_week, start_time, end_time })
    .returning("*");

  return newSlot;
};

export const getSlotsForWeek = async (startDate?: string) => {
    //determine week start date
    const startOfWeek = startDate ? dayjs(startDate).startOf('week') : dayjs().startOf('week');
    const weekDates = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day').format('YYYY-MM-DD'));

    //get all recurring slots
    const slots = await db('slots').select('*');

    // map slots to each day of the week
    let weekSlots: { date: string; slots: any[] }[] = weekDates.map((date) => {
        const dayOfWeek = dayjs(date).day(); //0 = sunday
        const slotsForDay = slots.filter((slot) => slot.day_of_week === dayOfWeek);
        return { date, slots: slotsForDay };
    });

    //apply exceptions
    const exceptions = await db('slot_exceptions').select('*').whereIn('date', weekDates);
    weekSlots = weekSlots.map((day) => {
        const dayExceptions = exceptions.filter((ex) => ex.date === day.date);
        let finalSlots = [...day.slots];

        dayExceptions.forEach((ex) => {
            if(ex.type === 'delete') {
                finalSlots = finalSlots.filter((s) => s.id !== ex.slot_id);
            }
            else if(ex.type === 'edit') {
                finalSlots = finalSlots.map((s) => 
                    s.id === ex.slot_id ? { ...s, start_time: ex.start_time, end_time: ex.end_time } : s);
            }
        });

        return { date: day.date, slots: finalSlots };
    });
    return weekSlots;
}

export const updateSlot = async (
  id: number,
  updates: Partial<SlotInput>,
  currentWeekStart: string // pass current week's start date from frontend
) => {
  const slot = await db("slots").where({ id }).first();
  if (!slot) throw new Error("Slot not found");

  // --- Update the recurring slot itself ---
  const [updatedSlot] = await db("slots")
    .where({ id })
    .update(updates)
    .returning("*");

  // --- Automatically compute the date of this slot in the current week ---
  if (slot.is_recurring && currentWeekStart) {
    const slotDate = dayjs(currentWeekStart)
      .add(slot.day_of_week, "day")
      .format("YYYY-MM-DD");

    // insert or update exception
    const existingException = await db("slot_exceptions")
      .where({ slot_id: id, date: slotDate })
      .first();

    if (existingException) {
      await db("slot_exceptions")
        .where({ slot_id: id, date: slotDate })
        .update({
          start_time: updates.start_time ?? slot.start_time,
          end_time: updates.end_time ?? slot.end_time,
          type: "edit",
        });
    } else {
      await db("slot_exceptions").insert({
        slot_id: id,
        date: slotDate,
        start_time: updates.start_time ?? slot.start_time,
        end_time: updates.end_time ?? slot.end_time,
        type: "edit",
      });
    }
  }

  return updatedSlot;
};


export const deleteSlot = async (id: number, date?: string) => {
  const slot = await db('slots').where({ id }).first();
  if (!slot) throw new Error("Slot not found");

  // If recurring slot & date specified, create delete exception
  if (slot.is_recurring && date) {
    const [exception] = await db('slot_exceptions')
      .insert({
        slot_id: id,
        date,
        type: 'delete',
      })
      .returning('*');
    return exception;
  }

  // Otherwise delete slot entirely
  const deleted = await db('slots').where({ id }).del();
  if (!deleted) throw new Error("Slot not found");
  return { message: "Slot deleted successfully" };
};
