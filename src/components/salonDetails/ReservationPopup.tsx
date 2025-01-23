import React, { useState } from "react";
import { Term } from "../../models/Term";

interface ReservationPopupProps {
  term: Term;
  salonId: number;
  offerId: number;
  employeeId: number;
  date: string;
  onClose: () => void;
  onConfirm: (reservationData: {
    salonId: number;
    offerId: number;
    employeeId: number;
    reservationDateTime: string;
    userEmail: string;
  }) => void;
}

const ReservationPopup: React.FC<ReservationPopupProps> = ({
  term,
  salonId,
  offerId,
  employeeId,
  date,
  onClose,
  onConfirm,
}) => {
  const [userEmail, setUserEmail] = useState("");

  const handleConfirm = () => {
    if (!userEmail) {
      alert("Please enter your email.");
      return;
    }

    const reservationDateTime = `${date}T${term.startServices}`;
    onConfirm({
      salonId,
      offerId,
      employeeId,
      reservationDateTime,
      userEmail,
    });
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup">
        <h3>Confirm Reservation</h3>
        <p>
          <strong>Term:</strong> {term.startServices} - {term.endServices}
        </p>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <div>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
};

export default ReservationPopup;
