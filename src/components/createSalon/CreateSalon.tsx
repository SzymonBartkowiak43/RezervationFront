import React, { useState } from "react";
import "./CreateSalon.css";
import header from "../header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateSalon({ email }: { email?: string }) {
    const [salonName, setSalonName] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const generateCode = async () => {
        try {
            const response = await axios.post("http://localhost:8080/generateCode");
            setCode(response.data.code);
        } catch (error) {
            console.error("Błąd podczas generowania kodu:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            alert("Proszę wygenerować lub wpisać kod!");
            return;
        }

        const newSalon = {
            salonName,
            category,
            city,
            zipCode,
            street,
            number,
            email,
            code,
        };

        try {
            const response = await axios.post("http://localhost:8080/salon", newSalon);
            console.log("Salon stworzony:", response.data);
            const salonId = response.data.salonId;
            navigate(`/add-opening-hours/${salonId}`);
        } catch (error) {
            console.error("Błąd podczas tworzenia salonu:", error);
        }
    };

    return (
        <div className="create-salon">
            <button onClick={generateCode}>Generate Code</button>
            {code && <p>Wygenerowany kod: {code}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Salon Name"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Street Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                />

                {/* Pole do ręcznego wpisania kodu */}
                <input
                    type="text"
                    placeholder="Wklej kod"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />

                {/* Email – zabezpieczamy przed przekazaniem undefined */}
                <input
                    type="email"
                    value={email || ""}
                    placeholder="Email (auto-filled)"
                    disabled
                    style={{ display: "none" }}
                />

                <button type="submit">Create Salon</button>
            </form>
        </div>
    );
}

export default header(CreateSalon, "Rezerwacje");
