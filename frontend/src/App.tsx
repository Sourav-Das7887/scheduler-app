import React, { useRef } from "react";
import { Calendar } from "./components/Calendar/Calendar";
import { useSlots } from "./hooks/useSlots";
import { useWeekScroll } from "./hooks/useWeekScroll";

function App() {
  const {
    slots,
    loading,
    error,
    currentWeekStart,
    createSlot,
    updateSlot,
    deleteSlot,
    loadNextWeek,
    loadPreviousWeek,
  } = useSlots();

  const containerRef = useRef<HTMLDivElement>(null);

  // Attach scroll detection
  useWeekScroll(containerRef, loadNextWeek, loadPreviousWeek);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="container mx-auto p-4 h-screen overflow-auto"
    >
      <Calendar
        currentDate={currentWeekStart}
        slots={slots}
        onCreateSlot={createSlot}
        onUpdateSlot={updateSlot}
        onDeleteSlot={deleteSlot}
        loadNextWeek={loadNextWeek}
        loadPreviousWeek={loadPreviousWeek}
        goToWeek={() => {}}
      />

      {loading && (
        <div className="text-center py-4">
          <div className="loading-spinner"></div>
          Loading...
        </div>
      )}
    </div>
  );
}

export default App;
