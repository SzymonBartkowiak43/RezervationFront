// AddOpeningHours.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
            const hour = i.toString().padStart(2, "0");
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

        const hasInvalidHours = openingHours.some((hour) => {
            const open = parseInt(hour.openingTime.split(":")[0]);
            const close = parseInt(hour.closingTime.split(":")[0]);
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
            await axios.patch("http://164.90.190.165:8080/salon/add-opening-hours", payload);
            navigate(`/owner/salon/${salonId}`);
        } catch (error) {
            console.error("Error when adding opening hours:", error);
        }
    };

    return (
        <>
            <style>{`
        .add-opening-hours {
            max-width: 1200px;
            margin: 100px auto 2rem;
            padding: 2rem;
            background: #3d3c3c;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            color: #f8f9fa;
            font-family: 'Poppins', sans-serif;
        }
        
        .add-opening-hours h2 {
            text-align: center;
            color: var(--accent-color);
            font-size: 2rem;
            margin-bottom: 2rem;
            text-transform: uppercase;
        }
        
        .hours-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .day-card {
            background: #4a4a4a;
            padding: 1.5rem;
            border-radius: 10px;
            border: 1px solid #5a5a5a;
        }
        
        .day-card h3 {
            margin: 0 0 1rem;
            color: var(--accent-color);
            font-size: 1.1rem;
            text-align: center;
        }
        
        .time-selectors {
            display: grid;
            gap: 1rem;
        }
        
        .time-group {
            display: grid;
            gap: 0.5rem;
        }
        
        .time-group label {
            font-size: 0.9rem;
            color: #a0aec0;
        }
        
        .time-group select {
            width: 100%;
            padding: 0.8rem;
            background: #5a5a5a;
            border: 2px solid #6a6a6a;
            border-radius: 8px;
            color: #f8f9fa;
            font-size: 1rem;
            appearance: none;
            transition: all 0.3s ease;
        }
        
        .time-group select:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.2);
        }
        
        .submit-button {
            background-color: var(--accent-color);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            width: fit-content;
            margin: 0 auto;
        }
        
        .submit-button:hover {
            background-color: #d45d3f;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .add-opening-hours {
                margin: 80px 1rem 2rem;
                padding: 1.5rem;
            }
        
            .hours-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
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
                                            onChange={(e) =>
                                                handleTimeChange(index, "openingTime", e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">-- Choose  --</option>
                                            {generateHourOptions().map((hour) => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="time-group">
                                        <label>Close:</label>
                                        <select
                                            value={item.closingTime}
                                            onChange={(e) =>
                                                handleTimeChange(index, "closingTime", e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">-- Choose --</option>
                                            {generateHourOptions().map((hour) => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
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
        </>
    );
}

export default header(AddOpeningHours, "Rezerwacje");
