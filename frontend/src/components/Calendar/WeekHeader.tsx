import React from "react";

interface WeekHeaderProps {
  month: string;
  year: number;
  onMonthYearChange: (month: number, year: number) => void;
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({
  month,
  year,
  onMonthYearChange,
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthYearChange(Number(e.target.value), year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthYearChange(months.indexOf(month), Number(e.target.value));
  };

  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i); // example: 2 years back and 2 years forward

  return (
    <div className="flex items-center justify-between mb-2">
      <select value={months.indexOf(month)} onChange={handleMonthChange} className="border p-1 rounded">
        {months.map((m, idx) => (
          <option key={m} value={idx}>{m}</option>
        ))}
      </select>

      <select value={year} onChange={handleYearChange} className="border p-1 rounded">
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};
