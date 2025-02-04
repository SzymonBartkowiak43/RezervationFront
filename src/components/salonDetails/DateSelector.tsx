import React from "react";
import "./SalonDetailsCSS.css";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {

    return (
        <div className="date-selector">
            <h3>Select a Date</h3>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
            />
        </div>
    );

};

export default DateSelector;
