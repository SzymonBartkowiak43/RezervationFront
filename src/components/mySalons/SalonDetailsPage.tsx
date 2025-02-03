import React, {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom";
import axios from "axios";
import "./SalonDetailsPage.css";
import header from "../header/Header";

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
    const {salonId} = useParams<{ salonId: string }>();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email") || "";

    const [salon, setSalon] = useState<SalonData | null>(null);

    // Stany dla formularza dodawania oferty
    const [offerName, setOfferName] = useState("");
    const [offerDescription, setOfferDescription] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [offerDuration, setOfferDuration] = useState(""); // liczba minut jako string

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

        // Konwersja czasu z minut na format "HH:mm"
        const minutes = parseInt(offerDuration, 10);
        const hoursPart = Math.floor(minutes / 60)
            .toString()
            .padStart(2, "0");
        const minutesPart = (minutes % 60).toString().padStart(2, "0");
        const durationFormatted = `${hoursPart}:${minutesPart}`;

        // Przygotowujemy obiekt zgodny z CreateOfferDto
        const createOfferDto = {
            name: offerName,
            description: offerDescription,
            price: parseFloat(offerPrice),
            duration: durationFormatted, // Format "HH:mm"
            salonId: Number(salonId),
        };

        try {
            const response = await axios.post("http://localhost:8080/offer", createOfferDto);
            console.log("New offer created:", response.data);

            // Załóżmy, że odpowiedź zawiera utworzoną ofertę o strukturze Offer
            const newOffer: Offer = response.data;

            // Aktualizujemy listę ofert
            setSalon((prevSalon) =>
                prevSalon ? {...prevSalon, offerDto: [...prevSalon.offerDto, newOffer]} : prevSalon
            );

            // Reset pól formularza
            setOfferName("");
            setOfferDescription("");
            setOfferPrice("");
            setOfferDuration("");
        } catch (error) {
            console.error("Error creating new offer:", error);
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
        </div>
    );
};

export default header(SalonDetailsPage, "Rezerwacje");
