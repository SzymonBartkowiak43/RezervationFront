// SalonDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./SalonDetailsPage.css";
import header from "../header/Header";
import AddEmployeeForm from "./AddEmployeeForm";
import AssignOfferForm from "./AssignOfferForm";

interface Reservation {
    reservationId: number;
    employeeName: string;
    offerName: string;
    price: number;
    reservationDateTimeStart: string;
    reservationDateTimeEnd: string;
}

interface Employee {
    employeeId: number;
    name: string;
    email: string;
    availability: { dayOfWeek: string; startTime: string | null; endTime: string | null }[];
    offerList: { id: number; name: string; description: string; price: number; duration: string }[];
}

interface Offer {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: string;
}

interface SalonData {
    salonName: string;
    reservationDto: Record<string, Reservation[]>;
    employeeDto: Employee[];
    offerDto: Offer[];
}

const SalonDetailsPage: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email") || "";

    const [salon, setSalon] = useState<SalonData | null>(null);

    const [offerName, setOfferName] = useState("");
    const [offerDescription, setOfferDescription] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [offerDuration, setOfferDuration] = useState("");


    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");

    const availableOffers: Offer[] = salon ? salon.offerDto : [];

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");

    useEffect(() => {
        fetch(`http://localhost:8080/owner/salon/${salonId}?email=${encodeURIComponent(email)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch salon data");
                }
                return response.json();
            })
            .then((data) => setSalon(data))
            .catch((error) => console.error("Error fetching salon details:", error));
    }, [salonId, email]);

    if (!salon) {
        return <p>Loading...</p>;
    }

    const handleOfferSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const minutes = parseInt(offerDuration, 10);
        const hoursPart = Math.floor(minutes / 60)
            .toString()
            .padStart(2, "0");
        const minutesPart = (minutes % 60).toString().padStart(2, "0");
        const durationFormatted = `${hoursPart}:${minutesPart}`;

        const createOfferDto = {
            name: offerName,
            description: offerDescription,
            price: parseFloat(offerPrice),
            duration: durationFormatted,
            salonId: Number(salonId),
        };

        try {
            const response = await axios.post("http://localhost:8080/offer", createOfferDto);
            console.log("New offer created:", response.data);

            const newOffer: Offer = response.data;

            setSalon((prevSalon) =>
                prevSalon ? { ...prevSalon, offerDto: [...prevSalon.offerDto, newOffer] } : prevSalon
            );

            setOfferName("");
            setOfferDescription("");
            setOfferPrice("");
            setOfferDuration("");
        } catch (error) {
            console.error("Error creating new offer:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setUploadStatus("No file selected!");
            return;
        }
        const formData = new FormData();
        formData.append("multipartFile", selectedFile);

        try {
            const response = await axios.post(
                `http://localhost:8080/salons/image/${salonId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Image upload response:", response.data);
            setUploadStatus("Uploading successful");
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploadStatus("Error uploading image");
        }
    };

    return (
        <div className="salon-container">
            <h1 className="salon-title">{salon.salonName}</h1>

            <section className="section">
                <h2>📅 Reservations</h2>
                {Object.entries(salon.reservationDto).length > 0 ? (
                    Object.entries(salon.reservationDto).map(([date, reservations]) => (
                        <div key={date} className="reservation-day">
                            <h3>{date}</h3>
                            {reservations.map((res) => (
                                <div key={res.reservationId} className="reservation-card">
                                    <p>
                                        <strong>{res.offerName}</strong> by {res.employeeName}
                                    </p>
                                    <p>
                                        {new Date(res.reservationDateTimeStart).toLocaleTimeString()} -{" "}
                                        {new Date(res.reservationDateTimeEnd).toLocaleTimeString()}
                                    </p>
                                    <p>💰 {res.price} PLN</p>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No reservations found.</p>
                )}
            </section>

            <section className="section">
                <h2>👨‍💼 Employees</h2>
                {salon.employeeDto.map((emp) => (
                    <div key={emp.employeeId} className="employee-card">
                        <h3>{emp.name}</h3>
                        <p>Email: {emp.email}</p>
                        <h4>Availability:</h4>
                        <ul>
                            {emp.availability.map((a, index) => (
                                <li key={index}>
                                    {a.dayOfWeek}: {a.startTime ? `${a.startTime} - ${a.endTime}` : "Unavailable"}
                                </li>
                            ))}
                        </ul>
                        <h4>Services Offered:</h4>
                        <ul>
                            {emp.offerList.map((offer) => (
                                <li key={offer.id}>
                                    {offer.name} - {offer.price} PLN ({offer.duration})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Sekcja dodawania nowego pracownika */}
            <section className="section">
                <h2>➕ Add New Employee</h2>
                <AddEmployeeForm salonId={Number(salonId)} />
            </section>

            <section className="section">
                <h2>💇‍♂️ Services</h2>
                <ul className="offer-list">
                    {salon.offerDto.map((offer) => (
                        <li key={offer.id} className="offer-item">
                            <strong>{offer.name}</strong>: {offer.description} - {offer.price} PLN ({offer.duration})
                        </li>
                    ))}
                </ul>

                <div className="offer-form-container">
                    <h3>Add New Offer</h3>
                    <form onSubmit={handleOfferSubmit} className="offer-form">
                        <input
                            type="text"
                            placeholder="Offer Name"
                            value={offerName}
                            onChange={(e) => setOfferName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={offerDescription}
                            onChange={(e) => setOfferDescription(e.target.value)}
                            required
                        ></textarea>
                        <input
                            type="number"
                            placeholder="Price"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            required
                            step="0.01"
                        />
                        <input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={offerDuration}
                            onChange={(e) => setOfferDuration(e.target.value)}
                            required
                            min="1"
                        />
                        <button type="submit">Add Offer</button>
                    </form>
                </div>
            </section>

            {/* Sekcja przypisywania oferty do pracownika - umieszczona na samym dole */}
            <section className="section">
                <h2>Assign Offer to Employee</h2>
                <div>
                    <label htmlFor="employee-select">Select an employee:</label>
                    <select
                        id="employee-select"
                        value={selectedEmployeeId}
                        onChange={(e) =>
                            setSelectedEmployeeId(Number(e.target.value))
                        }
                    >
                        <option value="">-- Choose --</option>
                        {salon.employeeDto.map((emp) => (
                            <option key={emp.employeeId} value={emp.employeeId}>
                                {emp.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedEmployeeId !== "" && (
                    <AssignOfferForm
                        employeeId={Number(selectedEmployeeId)}
                        availableOffers={availableOffers}
                        onSuccess={() => {
                            alert("Offer assigned successfully!");
                        }}
                    />
                )}
            </section>

            <section className="section">
                <h2>Upload Image</h2>
                <form onSubmit={handleImageUpload} className="image-upload-form">
                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                    <button type="submit">Upload Image</button>
                </form>
                {uploadStatus && <p>{uploadStatus}</p>}
            </section>
        </div>
    );
};

export default header(SalonDetailsPage, "Rezerwacje");
