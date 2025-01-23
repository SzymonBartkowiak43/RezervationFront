import React, { useEffect, useState } from 'react';
import { getUserReservations } from '../Services/reservationService';

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (email && token) {
            getUserReservations(email, token)
                .then(data => setReservations(data))
                .catch(error => console.error('Error fetching reservations:', error));
        }
    }, [email, token]);

    return (
        <div>
            <h2>Your Reservations</h2>
            <ul>
                {reservations.map((reservation) => (
                    <li key={reservation.reservationId}>
                        <strong>Reservation ID:</strong> {reservation.reservationId} <br />
                        <strong>Date and Time:</strong> {new Date(reservation.reservationDateTime).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserReservations;
