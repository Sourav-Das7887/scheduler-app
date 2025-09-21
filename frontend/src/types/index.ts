// src/types/index.ts
export interface TimeSlot {
  id: string;
  startTime: string;    // Format: "HH:MM"
  endTime: string;      // Format: "HH:MM"
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  date: string;         // Format: "YYYY-MM-DD"
  isRecurring: boolean;
  recurringId?: string;
}

export interface CreateSlotData {
  startTime: string;    // Format: "HH:MM"
  endTime: string;      // Format: "HH:MM"
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  isRecurring: boolean;
  date: string;
}

export interface UpdateSlotData {
  startTime?: string;
  endTime?: string;
}