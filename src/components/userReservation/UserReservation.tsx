import React, { useEffect, useState } from "react";
import { getUserReservations, deleteReservation, updateReservation, getNearest5Reservations } from "../../Services/reservationService";
import "./UserReservation.css";

const UserReservations = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
    const [availableDates, setAvailableDates] = useState<any[]>([]); // Nowy stan na dostępne terminy
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (email && token) {
            fetchReservations();
        }
    }, [email, token]);

    const fetchReservations = () => {
        getUserReservations(email!, token!)
            .then((data) => setReservations(data))
            .catch((error) => console.error("Error fetching reservations:", error));
    };

    const handleSelectReservation = (reservation: any) => {
        setSelectedReservation(reservation);
        setAvailableDates([]); // Czyścimy poprzednie dostępne terminy
    };

    const handleDeleteReservation = (id: string) => {
        if (token && email) {
            deleteReservation(id, email, token)
                .then(() => {
                    alert("Reservation deleted successfully.");
                    fetchReservations();
                    setSelectedReservation(null);
                })
                .catch((error) => console.error("Error deleting reservation:", error));
        } else {
            alert("User is not authenticated.");
        }
    };

    const handleUpdateReservation = (newDateTime: string) => {
        if (!selectedReservation) return;

        const updatedData = {
            reservationId: selectedReservation.reservationId, // Zamiast id
            newReservationDate: newDateTime, // Zamiast reservationDateTime
        };



        updateReservation(updatedData)
            .then(() => {
                alert("Reservation updated successfully.");
                fetchReservations();
                setSelectedReservation(null);
                setAvailableDates([]);
            })
            .catch((error) => console.error("Error updating reservation:", error));
    };


    const fetchNearestAvailableDates = () => {
        if (selectedReservation) {
            getNearest5Reservations(selectedReservation.reservationId)
                .then((data) => setAvailableDates(data))
                .catch((error) => console.error("Error fetching nearest dates:", error));
        }
    };

    return (
        <div className="user-reservations">
            <h2>Your Reservations</h2>
            {reservations.length > 0 ? (
                <ul className="reservations-list">
                    {reservations.map((reservation) => (
                        <li key={reservation.reservationId}>
                            <p>
                                <strong>Salon:</strong> {reservation.salonName}
                            </p>
                            <p>
                                <strong>Employee:</strong> {reservation.employeeName}
                            </p>
                            <p>
                                <strong>Service:</strong> {reservation.offerName}
                            </p>
                            <p>
                                <strong>Date and Time:</strong> {new Date(reservation.reservationDateTime).toLocaleString()}
                            </p>
                            <button onClick={() => handleSelectReservation(reservation)}>Select</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reservations found.</p>
            )}

            {selectedReservation && (
                <div className="selected-reservation">
                    <h3>Selected Reservation</h3>
                    <p>
                        <strong>Salon:</strong> {selectedReservation.salonName}
                    </p>
                    <p>
                        <strong>Employee:</strong> {selectedReservation.employeeName}
                    </p>
                    <p>
                        <strong>Service:</strong> {selectedReservation.offerName}
                    </p>
                    <p>
                        <strong>Date and Time:</strong> {new Date(selectedReservation.reservationDateTime).toLocaleString()}
                    </p>
                    <button className="change-button" onClick={fetchNearestAvailableDates}>
                        Change
                    </button>
                    <button className="cancel-button" onClick={() => handleDeleteReservation(selectedReservation.reservationId)}>
                        Cancel
                    </button>

                    {availableDates.length > 0 && (
                        <div className="available-dates">
                            <h4>Available Dates:</h4>
                            <ul>
                                {availableDates.map((date, index) => (
                                    <li key={index}>
                                        {date.date} - {date.startServices} to {date.endServices}
                                        <button onClick={() => handleUpdateReservation(`${date.date}T${date.startServices}`)}>Change to this</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>

    );
};

export default UserReservations;
