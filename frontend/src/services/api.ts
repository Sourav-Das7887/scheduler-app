// src/services/api.ts
import { TimeSlot, CreateSlotData, UpdateSlotData } from '../types';

const API_BASE_URL = 'https://scheduler-app-s0zn.onrender.com/';

// Convert frontend data format to backend format
const convertToBackendFormat = (slotData: CreateSlotData) => ({
  day_of_week: slotData.dayOfWeek,
  start_time: `${slotData.startTime}:00`,
  end_time: `${slotData.endTime}:00`
});

// Convert backend data format to frontend format
const convertToFrontendFormat = (backendSlot: any): TimeSlot => ({
  id: backendSlot.id.toString(),
  startTime: backendSlot.start_time.slice(0, 5), // Remove seconds
  endTime: backendSlot.end_time.slice(0, 5),     // Remove seconds
  dayOfWeek: backendSlot.day_of_week,
  date: backendSlot.date || new Date().toISOString().split('T')[0],
  isRecurring: true, // Your backend handles recurring logic
  recurringId: backendSlot.recurring_id
});

export const api = {
  // Get slots for a week - matches your backend endpoint
  getSlots: async (startDate: string): Promise<TimeSlot[]> => {
    const response = await fetch(
      `${API_BASE_URL}?start=${startDate}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch slots');
    }
    
    const weekSlots = await response.json();
    
    // Flatten the week structure to match frontend expectations
    const flattenedSlots: TimeSlot[] = [];
    weekSlots.forEach((day: any) => {
      day.slots.forEach((slot: any) => {
        flattenedSlots.push(convertToFrontendFormat({
          ...slot,
          date: day.date
        }));
      });
    });
    
    return flattenedSlots;
  },

  // Create a slot - matches your backend endpoint
  createSlot: async (slotData: CreateSlotData): Promise<TimeSlot> => {
    const backendData = convertToBackendFormat(slotData);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create slot');
    }
    
    const newSlot = await response.json();
    return convertToFrontendFormat(newSlot);
  },

  // Update a slot - matches your backend endpoint
  updateSlot: async (id: string, updates: UpdateSlotData): Promise<TimeSlot> => {
    const backendUpdates: any = {};
    
    if (updates.startTime) backendUpdates.start_time = `${updates.startTime}:00`;
    if (updates.endTime) backendUpdates.end_time = `${updates.endTime}:00`;
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendUpdates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update slot');
    }
    
    const updatedSlot = await response.json();
    return convertToFrontendFormat(updatedSlot);
  },

  // Delete a slot - matches your backend endpoint
  deleteSlot: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete slot');
    }
  },
};