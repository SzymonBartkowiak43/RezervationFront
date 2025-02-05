import React, {useState} from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    isToday,
    isBefore,
    parseISO
} from "date-fns";
import "./DateSelector.css";

interface DateSelectorProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    minDate?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({
                                                       selectedDate,
                                                       onDateChange,
                                                       minDate
                                                   }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const selectedDateObj = parseISO(selectedDate);
    const minDateObj = minDate ? parseISO(minDate) : null;

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const daysInMonth = eachDayOfInterval({start: startDate, end: endDate});

    const handleDateClick = (date: Date) => {
        onDateChange(format(date, "yyyy-MM-dd"));
    };

    const isDateDisabled = (date: Date) => {
        const isPast = minDateObj && isBefore(date, minDateObj);
        return !isSameMonth(date, currentMonth) || !!isPast;
    };

    return (
        <div>
            <h3>Select a Date</h3>
            <div className="calendar-container">
                <div className="calendar-header">
                    <button
                        onClick={handlePrevMonth}
                        aria-label="Previous month"
                    >
                        &lt;
                    </button>
                    <h2>{format(currentMonth, "MMMM yyyy")}</h2>
                    <button
                        onClick={handleNextMonth}
                        aria-label="Next month"
                    >
                        &gt;
                    </button>
                </div>

                <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}

                    {daysInMonth.map((date) => {
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isSelected = selectedDate && isSameDay(date, selectedDateObj);
                        const isTodayDate = isToday(date);
                        const disabled = isDateDisabled(date);

                        return (
                            <button
                                key={date.toString()}
                                className={`calendar-day 
                ${isSelected ? "selected" : ""}
                ${!isCurrentMonth ? "other-month" : ""}
                ${isTodayDate ? "today" : ""}
                ${disabled ? "disabled" : ""}`}
                                onClick={() => handleDateClick(date)}
                                disabled={disabled}
                                aria-label={`Choose ${format(date, "MMMM do, yyyy")}`}
                            >
                                <span>{format(date, "d")}</span>
                                {isTodayDate && <div className="today-indicator"/>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DateSelector;