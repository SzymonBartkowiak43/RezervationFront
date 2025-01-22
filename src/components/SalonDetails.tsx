import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SalonDetailsCSS.css";
import { getOffersBySalonId } from "../Services/offerService";
import {
  getEmployeeToOffer,
  getAvailableDates,
} from "../Services/employeeService";
import { createReservation } from "../Services/reservationService";

interface Offer {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface Term {
  startServices: string;
  endServices: string;
}

const SalonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availableTerms, setAvailableTerms] = useState<Term[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  useEffect(() => {
    getOffersBySalonId(id!)
      .then((response) => {
        setOffers(response.data);
        setLoadingOffers(false);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setLoadingOffers(false);
      });
  }, [id]);

  const fetchEmployees = (offerId: number) => {
    setLoadingEmployees(true);
    getEmployeeToOffer(offerId)
      .then((response) => {
        setEmployees(response.data);
        setLoadingEmployees(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoadingEmployees(false);
      });
  };

  const fetchAvailableTerms = () => {
    if (!selectedOfferId || !selectedEmployeeId || !selectedDate) {
      alert("Please select all options: Offer, Employee, and Date.");
      return;
    }

    setLoadingTerms(true);
    getAvailableDates(selectedEmployeeId, selectedDate, selectedOfferId)
      .then((response) => {
        setAvailableTerms(response.data);
        setLoadingTerms(false);
      })
      .catch((error) => {
        console.error("Error fetching available terms:", error);
        setLoadingTerms(false);
      });
  };

  const handleOfferSelect = (offerId: number) => {
    setSelectedOfferId(offerId);
    fetchEmployees(offerId);
  };

  const handleReservation = () => {
    if (
      !userEmail ||
      !selectedTerm ||
      !selectedOfferId ||
      !selectedEmployeeId ||
      !id
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const reservationData = {
      employeeId: selectedEmployeeId,
      offerId: selectedOfferId,
      salonId: Number(id),
      reservationDateTime: `${selectedDate}T${selectedTerm!.startServices}`,
      userEmail,
    };

    createReservation(reservationData)
      .then((response) => {
        alert("Reservation successful!");
        setShowPopup(false);
        setUserEmail("");
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
        alert("Failed to create reservation. Please try again.");
      });
  };

  return (
    <div className="salon-details">
      <h2>Available Offers for Salon {id}</h2>
      {loadingOffers ? (
        <div>Loading offers...</div>
      ) : (
        <select onChange={(e) => handleOfferSelect(Number(e.target.value))}>
          <option value="">Select an offer</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} - {offer.price}$
            </option>
          ))}
        </select>
      )}

      {selectedOfferId && (
        <select onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}>
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.employeeId}
            </option>
          ))}
        </select>
      )}

      <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
      <button onClick={fetchAvailableTerms}>Fetch Available Terms</button>

      {showPopup && (
        <div className="popup">
          <input
            type="email"
            placeholder="Enter email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <button onClick={handleReservation}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default SalonDetails;
