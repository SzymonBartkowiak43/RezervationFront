import React, { useEffect, useState } from "react";
import {
  getUserReservations,
  deleteReservation,
  updateReservation,
} from "../../Services/reservationService";
import "./UserReservation.css";
import header from "../header/Header";

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (email && token) {
      fetchReservations();
    }
  }, [email, token]);

  const fetchReservations = () => {
    getUserReservations(email, token)
      .then((data) => setReservations(data))
      .catch((error) => console.error("Error fetching reservations:", error));
  };

  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
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

  const handleUpdateReservation = () => {
    const updatedData = {
      id: selectedReservation.reservationId,
      reservationDateTime: new Date().toISOString(),
    };

    updateReservation(updatedData)
      .then(() => {
        alert("Reservation updated successfully.");
        fetchReservations();
        setSelectedReservation(null);
      })
      .catch((error) => console.error("Error updating reservation:", error));
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
                <strong>Date and Time:</strong>{" "}
                {new Date(reservation.reservationDateTime).toLocaleString()}
              </p>
              <button onClick={() => handleSelectReservation(reservation)}>
                Select
              </button>
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
            <strong>Date and Time:</strong>{" "}
            {new Date(selectedReservation.reservationDateTime).toLocaleString()}
          </p>
          <button className="change-button" onClick={handleUpdateReservation}>
            Change
          </button>
          <button
            className="cancel-button"
            onClick={() =>
              handleDeleteReservation(selectedReservation.reservationId)
            }
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default header(UserReservations, "Rezerwacje");
