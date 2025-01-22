import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

interface DateFilterProps {
  onFilterChange: (filter: {
    date?: number;
    month?: number;
    year?: number;
  }) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState<number | undefined>(
    undefined,
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  // Handle changes and notify parent
  const handleDateChange = (date: Date | null) => {
    const day = date ? dayjs(date).date() : undefined;
    setSelectedDate(day);
    onFilterChange({ date: day, month: selectedMonth, year: selectedYear });
  };

  const handleMonthChange = (date: Date | null) => {
    const month = date ? dayjs(date).month() : undefined;
    setSelectedMonth(month);
    onFilterChange({ date: selectedDate, month, year: selectedYear });
  };

  const handleYearChange = (date: Date | null) => {
    const year = date ? dayjs(date).year() : undefined;
    setSelectedYear(year);
    onFilterChange({ date: selectedDate, month: selectedMonth, year });
  };

  return (
    <>
      {/* Date Filter */}
      <label htmlFor="date" className="text-sm">
        <p>Date:</p>
        <DatePicker
          id="date"
          selected={selectedDate ? dayjs().date(selectedDate).toDate() : null}
          onChange={handleDateChange}
          dateFormat="d"
          showPopperArrow={false}
          placeholderText="Select Date"
          className="py-1 px-2 w- rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
        />
      </label>

      {/* Month Filter */}
      <label htmlFor="month" className="text-sm">
        <p>Month:</p>
        <DatePicker
          id="month"
          selected={
            selectedMonth !== undefined
              ? dayjs().month(selectedMonth).toDate()
              : null
          }
          onChange={handleMonthChange}
          dateFormat="MMMM"
          showMonthYearPicker
          showPopperArrow={false}
          placeholderText="Select Month"
          className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
        />
      </label>

      {/* Year Filter */}
      <label htmlFor="year" className="text-sm">
        <p>Year:</p>
        <DatePicker
          id="year"
          selected={selectedYear ? dayjs().year(selectedYear).toDate() : null}
          onChange={handleYearChange}
          dateFormat="yyyy"
          showYearPicker
          showPopperArrow={false}
          placeholderText="Select Year"
          className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
        />
      </label>
    </>
  );
};

export default DateFilter;
