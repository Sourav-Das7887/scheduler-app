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

export const updateSlot = async (id: number, updates: Partial<SlotInput>) => {
    const [updatedSlot] = await db('slots')
        .where({ id })
        .update(updates)
        .returning('*');

    if(!updatedSlot) {
        throw new Error("Slot not found");
    }
    return updatedSlot;
};

export const deleteSlot = async (id: number) => {
    const deleted = await db('slots')
        .where({ id })
        .del();
    if(!deleted){
        throw new Error("Slot not found");
    }
    return { message: "Slot deleted successfully" };
}