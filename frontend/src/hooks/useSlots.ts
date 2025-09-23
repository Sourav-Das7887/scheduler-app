// src/hooks/useSlots.ts
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
    setLoading(true); setError(null);
    try {
      const { start } = getWeekRange(weekStart);
      const weekSlots = await api.getSlots(start);
      setSlots(weekSlots);
      setHasMore(weekSlots.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch slots");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSlotsForWeek(currentWeekStart); }, [currentWeekStart]);

  const loadNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const loadPreviousWeek = () => setCurrentWeekStart(prev => addWeeks(prev, -1));

  const createSlot = async (slotData: CreateSlotData) => {
    await api.createSlot(slotData);
    await fetchSlotsForWeek(currentWeekStart);
  };

  const updateSlot = async (id: string, updates: UpdateSlotData, slotDate: string) => {
    await api.updateSlot(id, updates, slotDate);
    await fetchSlotsForWeek(currentWeekStart); // refresh week to reflect exceptions
  };

  const deleteSlot = async (id: string, slotDate: string) => {
    await api.deleteSlot(id, slotDate);
    await fetchSlotsForWeek(currentWeekStart); // refresh week to reflect exceptions
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
