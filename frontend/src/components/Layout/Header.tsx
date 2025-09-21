// src/components/Layout/Header.tsx
import React from "react";

interface HeaderProps {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ monthLabel, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-between py-4 px-2 bg-white shadow sticky top-0 z-10">
      <button
        onClick={onPrevious}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Previous
      </button>

      <div className="text-lg font-semibold">{monthLabel}</div>

      <button
        onClick={onNext}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};
