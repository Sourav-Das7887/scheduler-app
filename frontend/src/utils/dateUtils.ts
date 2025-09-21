// src/utils/dateUtils.ts
export const getWeekRange = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  return {
    start: start.toISOString().split('T')[0], // Format: "YYYY-MM-DD"
  };
};

export const addWeeks = (date: Date, weeks: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];