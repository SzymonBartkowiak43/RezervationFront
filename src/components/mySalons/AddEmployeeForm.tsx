import React, { useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import "./AddEmployeeForm.css";

const defaultAvailability = [
    { dayOfWeek: "MONDAY", startTime: "", endTime: "" },
    { dayOfWeek: "TUESDAY", startTime: "", endTime: "" },
    { dayOfWeek: "WEDNESDAY", startTime: "", endTime: "" },
    { dayOfWeek: "THURSDAY", startTime: "", endTime: "" },
    { dayOfWeek: "FRIDAY", startTime: "", endTime: "" },
    { dayOfWeek: "SATURDAY", startTime: "", endTime: "" },
    { dayOfWeek: "SUNDAY", startTime: "", endTime: "" },
];

const AddEmployeeForm = ({ salonId }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [availability, setAvailability] = useState(defaultAvailability);

    const handleInputChange = (index, field, value) => {
        const newAvailability = [...availability];
        newAvailability[index][field] = value;
        setAvailability(newAvailability);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employeeDto = {
            salonId,
            name,
            email,
            availability,
        };

        try {
            const response = await axios.post(
                `http://localhost:8080/salon/${salonId}/employee`,
                employeeDto
            );

            if (response.status === 200) {
                alert("Employee added successfully!");
                window.location.reload();
            } else {
                alert("Error adding employee.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while adding the employee.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-employee-form">
            <div>
                <label>Employee Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Employee Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <h3>Availability</h3>
                {availability.map((slot, index) => (
                    <div key={index} className="time-input-group">
                        <label>{slot.dayOfWeek}</label>
                        <input
                            type="time"
                            step="3600"
                            value={slot.startTime}
                            onChange={(e) => handleInputChange(index, "startTime", e.target.value)}
                            required
                        />
                        <span>to</span>
                        <input
                            type="time"
                            step="3600"
                            value={slot.endTime}
                            onChange={(e) => handleInputChange(index, "endTime", e.target.value)}
                            required
                        />
                    </div>
                ))}
            </div>
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default Header(AddEmployeeForm, "Rezerwacje");
