import React from "react";
import { TimeSlot as TimeSlotType } from "../../types";
import { FaTrash } from "react-icons/fa";

interface TimeSlotProps {
  slot: TimeSlotType;
  onEdit: (slot: TimeSlotType) => void;
  onDelete: (id: string) => void;
}

export const TimeSlotComponent: React.FC<TimeSlotProps> = ({
  slot,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-blue-100 rounded p-1 mb-1 text-sm relative group">
      <div>
        {slot.startTime} - {slot.endTime}
        {slot.isRecurring && (
          <span className="text-xs text-gray-500 ml-1">Recurring</span>
        )}
      </div>

      <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(slot)} className="text-xs p-1 text-blue-600">
          Edit
        </button>
        <button onClick={() => onDelete(slot.id)} className="text-xs p-1 text-red-600">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};
