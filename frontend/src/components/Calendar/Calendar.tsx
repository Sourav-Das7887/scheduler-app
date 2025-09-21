import React, { useState, useEffect, useRef } from "react";
import { TimeSlot, CreateSlotData } from "../../types";
import { WeekView } from "./WeekView";
import { Modal } from "../UI/Modal";
import { TimePicker } from "../UI/TimePicker";
import { formatDate } from "../../utils/dateUtils";

interface CalendarProps {
  currentDate: Date;
  slots: TimeSlot[];
  onCreateSlot: (data: CreateSlotData) => Promise<TimeSlot | void>;
  onUpdateSlot: (id: string, updates: { startTime?: string; endTime?: string }) => Promise<void>;
  onDeleteSlot: (id: string) => Promise<void>;
  loadNextWeek: () => void;
  loadPreviousWeek: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  slots,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot,
  loadNextWeek,
  loadPreviousWeek,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isRecurring, setIsRecurring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) loadNextWeek();
      else if (e.deltaY < 0) loadPreviousWeek();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [loadNextWeek, loadPreviousWeek]);

  const handleAddSlot = (date: Date) => {
    setSelectedDate(date);
    setStartTime("09:00");
    setEndTime("10:00");
    setIsRecurring(true);
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setIsRecurring(slot.isRecurring);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!startTime || !endTime || !selectedDate) return;
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    setIsLoading(true);
    try {
      if (editingSlot) {
        await onUpdateSlot(editingSlot.id, { startTime, endTime });
      } else {
        await onCreateSlot({
          startTime,
          endTime,
          dayOfWeek: selectedDate.getDay(),
          isRecurring,
          date: selectedDate.toISOString().split("T")[0],
        });
        // Do not throw error; let scrolling reload show the new slot
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save slot:", err);
      // Remove alert; backend will eventually show slot after scrolling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={scrollContainerRef} className="p-2 overflow-auto">
      {/* Top month/year header */}
      <div className="text-center font-bold mb-4 text-lg">
        {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </div>

      <WeekView
        currentDate={currentDate}
        slots={slots}
        onAddSlot={handleAddSlot}
        onEditSlot={handleEditSlot}
        onDeleteSlot={onDeleteSlot}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlot ? "Edit Slot" : "Create Slot"}
      >
        {selectedDate && <div className="mb-4">Date: {formatDate(selectedDate)}</div>}
        <div className="mb-4">
          <label>Start Time</label>
          <TimePicker value={startTime} onChange={setStartTime} />
        </div>
        <div className="mb-4">
          <label>End Time</label>
          <TimePicker value={endTime} onChange={setEndTime} />
        </div>
        {!editingSlot && (
          <div className="mb-4">
            <label>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />{" "}
              Recurring
            </label>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isLoading ? "Saving..." : editingSlot ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
