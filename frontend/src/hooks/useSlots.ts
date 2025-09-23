import { useState, useEffect } from "react";
import { TimeSlot, CreateSlotData, UpdateSlotData } from "../types";
import { api } from "../services/api";
import { getWeekRange, addWeeks } from "../utils/dateUtils";

export const useSlots = () => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [hasMore, setHasMore] = useState(true);

  const fetchSlotsForWeek = async (weekStart: Date) => {
    setLoading(true);
    setError(null);

    try {
      const { start } = getWeekRange(weekStart); // string "YYYY-MM-DD"
      const weekSlots = await api.getSlots(start);
      setSlots(weekSlots); // ✅ replace old slots for this week
      setHasMore(weekSlots.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsForWeek(currentWeekStart);
  }, [currentWeekStart]);

  const loadNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const loadPreviousWeek = () => setCurrentWeekStart(prev => addWeeks(prev, -1));

  const createSlot = async (slotData: CreateSlotData) => {
  await api.createSlot(slotData);
  await fetchSlotsForWeek(currentWeekStart); // refresh slots for the visible week
};


  const updateSlot = async (id: string, updates: UpdateSlotData) => {
    const updatedSlot = await api.updateSlot(id, updates);
    setSlots(prev => prev.map(s => (s.id === id ? updatedSlot : s)));
  };

  const deleteSlot = async (id: string) => {
    await api.deleteSlot(id);
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  return {
    slots,
    loading,
    error,
    currentWeekStart,
    hasMore,
    createSlot,
    updateSlot,
    deleteSlot,
    loadNextWeek,
    loadPreviousWeek,
  };
};
