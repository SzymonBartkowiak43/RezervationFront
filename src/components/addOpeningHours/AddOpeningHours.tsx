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
        const payload = openingHours.map((item) => ({
            salonId: Number(salonId),
            dayOfWeek: item.dayOfWeek,
            openingTime: item.openingTime,
            closingTime: item.closingTime,
        }));

        try {
            const response = await axios.patch(
                "http://localhost:8080/salon/add-opening-hours",
                payload
            );
            console.log("Godziny otwarcia dodane:", response.data);
            navigate(`/owner/salon/${salonId}`);
        } catch (error) {
            console.error("Błąd podczas dodawania godzin otwarcia:", error);
        }
    };

    return (
        <div className="add-opening-hours">
            <h2>Podaj godziny otwarcia salonu</h2>
            <form onSubmit={handleSubmit}>
                {openingHours.map((item, index) => (
                    <div key={item.dayOfWeek} className="day-hours">
                        <label>{item.dayOfWeek}</label>
                        <input
                            type="time"
                            value={item.openingTime}
                            onChange={(e) => handleTimeChange(index, "openingTime", e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={item.closingTime}
                            onChange={(e) => handleTimeChange(index, "closingTime", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="submit">Zapisz godziny otwarcia</button>
            </form>
        </div>
    );
}

export default header(AddOpeningHours, "Rezerwacje");
