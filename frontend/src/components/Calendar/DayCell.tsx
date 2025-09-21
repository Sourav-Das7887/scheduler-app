import React from "react";
import { TimeSlot } from "../../types";
import { TimeSlotComponent } from "./TimeSlot";

interface DayCellProps {
  date: Date;
  slots: TimeSlot[];
  onAddSlot: () => void;
  onEditSlot: (slot: TimeSlot) => void;
  onDeleteSlot: (id: string) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  slots,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
}) => {
  const canAddSlot = slots.length < 2;
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className={`border rounded p-2 min-h-24 ${isToday ? "bg-blue-50" : ""}`}>
      {/* Day header */}
      <div className="text-center font-semibold mb-2">
        <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
        <div>{date.getDate()}</div>
        <div>{date.toLocaleDateString("en-US", { month: "long" })}</div>
        {isToday && <div className="text-xs text-red-500">(Today)</div>}
      </div>

      {/* Scheduled slots */}
      {slots.map((slot) => (
        <TimeSlotComponent
          key={slot.id}
          slot={slot}
          onEdit={onEditSlot}
          onDelete={onDeleteSlot}
        />
      ))}

      {/* + button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onAddSlot}
          disabled={!canAddSlot}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            canAddSlot ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
};
