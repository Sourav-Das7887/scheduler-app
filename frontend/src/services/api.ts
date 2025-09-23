// src/services/api.ts
import { TimeSlot, CreateSlotData, UpdateSlotData } from '../types';

const API_BASE_URL = 'https://scheduler-app-s0zn.onrender.com/slots';

// Convert frontend to backend format
const convertToBackendFormat = (slotData: CreateSlotData) => ({
  day_of_week: slotData.dayOfWeek,
  start_time: `${slotData.startTime}:00`,
  end_time: `${slotData.endTime}:00`,
});

// Convert backend to frontend format
const convertToFrontendFormat = (backendSlot: any, date?: string): TimeSlot => ({
  id: backendSlot.id.toString(),
  startTime: backendSlot.start_time.slice(0, 5),
  endTime: backendSlot.end_time.slice(0, 5),
  dayOfWeek: backendSlot.day_of_week,
  date: date || backendSlot.date || new Date().toISOString().split('T')[0],
  isRecurring: backendSlot.is_recurring ?? true,
  recurringId: backendSlot.recurring_id
});

export const api = {
  getSlots: async (startDate: string): Promise<TimeSlot[]> => {
    const response = await fetch(`${API_BASE_URL}?start=${startDate}`);
    if (!response.ok) throw new Error('Failed to fetch slots');

    const data = await response.json(); // { slots: [...] }
    const flattened: TimeSlot[] = [];

    data.slots.forEach((day: any) => {
      day.slots.forEach((slot: any) => {
        flattened.push(convertToFrontendFormat(slot, day.date));
      });
    });

    return flattened;
  },

  createSlot: async (slotData: CreateSlotData): Promise<TimeSlot> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(convertToBackendFormat(slotData)),
    });
    if (!response.ok) throw new Error('Failed to create slot');

    const newSlot = await response.json();
    return convertToFrontendFormat(newSlot);
  },

  updateSlot: async (id: string, updates: UpdateSlotData, date?: string): Promise<TimeSlot> => {
    const backendUpdates: any = {};
    if (updates.startTime) backendUpdates.start_time = `${updates.startTime}:00`;
    if (updates.endTime) backendUpdates.end_time = `${updates.endTime}:00`;
    if (date) backendUpdates.date = date; // send date for recurring exception

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendUpdates),
    });
    if (!response.ok) throw new Error('Failed to update slot');

    const updatedSlot = await response.json();
    return convertToFrontendFormat(updatedSlot, date);
  },

  deleteSlot: async (id: string, date?: string): Promise<void> => {
    const url = date ? `${API_BASE_URL}/${id}?date=${date}` : `${API_BASE_URL}/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete slot');
  }
};
