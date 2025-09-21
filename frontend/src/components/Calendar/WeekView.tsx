import React from "react";
import { TimeSlot } from "../../types";
import { DayCell } from "./DayCell";
import { getWeekRange } from "../../utils/dateUtils";

interface WeekViewProps {
  currentDate: Date;
  slots: TimeSlot[];
  onAddSlot: (date: Date) => void;
  onEditSlot: (slot: TimeSlot) => void;
  onDeleteSlot: (id: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  slots,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) => {
  const { start } = getWeekRange(currentDate);
  const weekStart = new Date(start);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  return (
    <div className="flex gap-4 overflow-x-auto">
      {days.map((date, idx) => {
        const daySlots = slots.filter(
          (slot) => new Date(slot.date).toDateString() === date.toDateString()
        );

        return (
          <DayCell
            key={idx}
            date={date}
            slots={daySlots}
            onAddSlot={() => onAddSlot(date)}
            onEditSlot={onEditSlot}
            onDeleteSlot={onDeleteSlot}
          />
        );
      })}
    </div>
  );
};
