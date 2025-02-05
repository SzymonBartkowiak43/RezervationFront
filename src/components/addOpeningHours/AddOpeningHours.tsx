// AddOpeningHours.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddOpeningHours.css";
import header from "../header/Header";

const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

interface OpeningHour {
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
}

function AddOpeningHours() {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();

    const [openingHours, setOpeningHours] = useState<OpeningHour[]>(
        daysOfWeek.map((day) => ({ dayOfWeek: day, openingTime: "", closingTime: "" }))
    );

    const generateHourOptions = () => {
        return Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            return `${hour}:00`;
        });
    };

    const handleTimeChange = (
        index: number,
        field: "openingTime" | "closingTime",
        value: string
    ) => {
        const updatedHours = [...openingHours];
        updatedHours[index] = { ...updatedHours[index], [field]: value };
        setOpeningHours(updatedHours);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hasInvalidHours = openingHours.some(hour => {
            const open = parseInt(hour.openingTime.split(':')[0]);
            const close = parseInt(hour.closingTime.split(':')[0]);
            return close <= open;
        });

        if (hasInvalidHours) {
            alert("The closing time must be later than the opening time!");
            return;
        }

        const payload = openingHours.map((item) => ({
            salonId: Number(salonId),
            dayOfWeek: item.dayOfWeek,
            openingTime: item.openingTime,
            closingTime: item.closingTime,
        }));

        try {
            await axios.patch(
                "http://localhost:8080/salon/add-opening-hours",
                payload
            );
            navigate(`/owner/salon/${salonId}`);
        } catch (error) {
            console.error("Error when adding opening hours:", error);
        }
    };

    return (
        <div className="add-opening-hours">
            <h2>Set your salon opening hours</h2>
            <form onSubmit={handleSubmit}>
                <div className="hours-grid">
                    {openingHours.map((item, index) => (
                        <div key={item.dayOfWeek} className="day-card">
                            <h3>{item.dayOfWeek}</h3>
                            <div className="time-selectors">
                                <div className="time-group">
                                    <label>Opening:</label>
                                    <select
                                        value={item.openingTime}
                                        onChange={(e) => handleTimeChange(index, "openingTime", e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose  --</option>
                                        {generateHourOptions().map((hour) => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="time-group">
                                    <label>Close:</label>
                                    <select
                                        value={item.closingTime}
                                        onChange={(e) => handleTimeChange(index, "closingTime", e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose --</option>
                                        {generateHourOptions().map((hour) => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-button">
                    Save the hours
                </button>
            </form>
        </div>
    );
}

export default header(AddOpeningHours, "Rezerwacje");