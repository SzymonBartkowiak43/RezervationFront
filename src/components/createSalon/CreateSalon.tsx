import React, { useState } from "react";
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
    const navigate = useNavigate();

    const generateCode = async () => {
        try {
            const response = await axios.post("http://164.90.190.165:8080/reservation-service/code/generateCode");
            setGeneratedCode(response.data.code);
        } catch (error) {
            console.error("Error during code generation:", error);
        }
    };

    const handleBoughtCode = async () => {
        try {
            const response = await axios.get("http://164.90.190.165:8060/reservation-service/code/get-link-to-code");
            window.open(response.data, "_blank");
        } catch (error) {
            console.error("Error while downloading the link:", error);
            alert("Error fetching code link");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputCode) {
            alert("Please enter the code!");
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
            const response = await axios.post("http://164.90.190.165:8080/salon", newSalon);
            console.log("Salon Created:", response.data);
            const salonId = response.data.salonId;
            navigate(`/add-opening-hours/${salonId}`);
        } catch (error) {
            console.error("Error when creating a salon:", error);
        }
    };

    return (
        <>
            <style>{`
                /* CreateSalon.css */
:root {
  --primary-color: #2c3e50;
  --accent-color: #e76f51;
  --background-dark: #3d3c3c;
  --input-background: #4a4a4a;
  --text-light: #f8f9fa;
  --text-muted: #a0aec0;
}

.create-salon {
  max-width: 800px;
  margin: 100px auto 2rem;
  padding: 2rem;
  background: var(--background-dark);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: var(--text-light);
  font-family: 'Poppins', sans-serif;
}

.create-salon h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.create-salon h1 span {
  color: var(--accent-color);
}

.code-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #4a4a4a;
  border-radius: 10px;
  border: 1px solid #5a5a5a;
}

.code-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.generate-button,
.bought-code-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generate-button {
  background: var(--accent-color);
  color: white;
}

.bought-code-button {
  background: var(--accent-color);
  color: white;
}

.generate-button:hover,
.bought-code-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.generated-code-info {
  padding: 1rem;
  background: rgba(231, 111, 81, 0.1);
  border-radius: 8px;
  border: 1px solid var(--accent-color);
  text-align: center;
}

.generated-code-info strong {
  color: var(--accent-color);
  font-size: 1.2rem;
}

.create-salon form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.create-salon input {
  width: 100%;
  padding: 0.8rem;
  background: var(--input-background);
  border: 2px solid #5a5a5a;
  border-radius: 8px;
  color: var(--text-light);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.create-salon input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.2);
}

.create-salon button[type="submit"] {
  grid-column: span 2;
  background: var(--accent-color);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-salon button[type="submit"]:hover {
  background: #d45d3f;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .create-salon {
    margin: 80px 1rem 2rem;
    padding: 1.5rem;
  }

  .create-salon form {
    grid-template-columns: 1fr;
  }

  .code-buttons {
    flex-direction: column;
  }

  .create-salon button[type="submit"] {
    grid-column: span 1;
  }
}
            `}</style>

            <div className="create-salon">
                <h1>
                    Create Salon
                </h1>
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
                            <p>
                                Free code: <strong>{generatedCode}</strong>
                            </p>
                            <small>Copy and paste the code below</small>
                        </div>
                    )}
                </div>
                <form className="create-salon-form" onSubmit={handleSubmit}>
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
        </>
    );
}

export default header(CreateSalon, "Rezerwacje");
