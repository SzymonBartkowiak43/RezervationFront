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
    const [generatedCode, setGeneratedCode] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [boughtCodeLink, setBoughtCodeLink] = useState("");
    const navigate = useNavigate();

    const generateCode = async () => {
        try {
            const response = await axios.post("http://localhost:8080/reservation-service/code/generateCode");
            setGeneratedCode(response.data.code);
        } catch (error) {
            console.error("Błąd podczas generowania kodu:", error);
        }
    };

    // Nowa funkcja do pobierania linku
    const handleBoughtCode = async () => {
        try {
            const response = await axios.get("http://localhost:8060/reservation-service/code/get-link-to-code");
            setBoughtCodeLink(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania linku:", error);
            alert("Error fetching code link");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputCode) {
            alert("Proszę wpisać kod!");
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
            code: inputCode,
        };

        try {
            const response = await axios.post("http://localhost:8080/salon", newSalon);
            console.log("Salon Created:", response.data);
            const salonId = response.data.salonId;
            navigate(`/add-opening-hours/${salonId}`);
        } catch (error) {
            console.error("Błąd podczas tworzenia salonu:", error);
        }
    };

    return (
        <div className="create-salon">
            <div className="code-section">
                <div className="code-buttons">
                    <button type="button" onClick={generateCode} className="generate-button">
                        Generate Free Code
                    </button>
                    <button type="button" onClick={handleBoughtCode} className="bought-code-button">
                        Bought Code
                    </button>
                </div>

                {generatedCode && (
                    <div className="generated-code-info">
                        <p>Free code: <strong>{generatedCode}</strong></p>
                        <small>Copy and paste the code below</small>
                    </div>
                )}

                {boughtCodeLink && (
                    <div className="bought-code-info">
                        <p>Purchase code at:
                            <a href={boughtCodeLink} target="_blank" rel="noopener noreferrer" className="code-link">
                                {boughtCodeLink}
                            </a>
                        </p>
                        <small>Visit link and paste code below</small>
                    </div>
                )}
            </div>

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

                <input
                    type="text"
                    placeholder="Paste Code Here"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    required
                />

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
