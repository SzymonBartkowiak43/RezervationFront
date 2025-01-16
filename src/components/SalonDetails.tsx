import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./SalonDetailsCSS.css";

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
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");

    const [loadingOffers, setLoadingOffers] = useState(true);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingTerms, setLoadingTerms] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

    useEffect(() => {
        axios
            .get(`http://164.90.243.197:8080/offers/${id}`)
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
        axios
            .get(`http://164.90.243.197:8080/employee-to-offer/${offerId}`)
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
        console.log("selectedOfferId:", selectedOfferId);
        console.log("selectedEmployeeId:", selectedEmployeeId);
        console.log("selectedDate:", selectedDate);

        if (!selectedOfferId || !selectedEmployeeId || !selectedDate) {
            console.log("Missing data for request.");
            alert("Please select all options: Offer, Employee, and Date.");
            return;
        }

        console.log("Sending GET request with data:", {
            date: selectedDate,
            employeeId: selectedEmployeeId,
            offerId: selectedOfferId,
        });

        setLoadingTerms(true);

        const url = `http://164.90.243.197:8080/employee/available-dates?date=${selectedDate}&employeeId=${selectedEmployeeId}&offerId=${selectedOfferId}`;

        axios
            .get(url)
            .then((response) => {
                console.log("Received available terms:", response.data);
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

    const handleEmployeeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const employeeId = Number(event.target.value);
        if (!isNaN(employeeId)) {
            setSelectedEmployeeId(employeeId);
        } else {
            console.error("Invalid employee ID:", event.target.value);
        }
    };


    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const handleFetchTermsClick = () => {
        fetchAvailableTerms();
    };

    return (
        <div className="salon-details">
            <h2>Available Offers for Salon {id}</h2>

            {loadingOffers ? (
                <div>Loading offers...</div>
            ) : (
                <div>
                    <h3>Select a Service</h3>
                    <select onChange={(e) => handleOfferSelect(Number(e.target.value))}>
                        <option value="">Select an offer</option>
                        {offers.map((offer) => (
                            <option key={offer.id} value={offer.id}>
                                {offer.name} - {offer.price}$
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedOfferId && (
                <div>
                    <h3>Select an Employee</h3>
                    {loadingEmployees ? (
                        <div>Loading employees...</div>
                    ) : (
                        <select onChange={handleEmployeeSelect}>
                            <option value="">Select an employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.employeeId}
                                </option>
                            ))}
                        </select>
                    )}

                </div>
            )}

            <div>
                <h3>Select a Date</h3>
                <input type="date" value={selectedDate} onChange={handleDateChange}/>
            </div>

            <button onClick={handleFetchTermsClick}>Fetch Available Terms</button>

            {loadingTerms ? (
                <div>Loading available terms...</div>
            ) : (
                <div>
                    {availableTerms.length === 0 ? (
                        <p>No available terms for this selection.</p>
                    ) : (
                        <ul>
                            {availableTerms.map((term, index) => (
                                <li key={index}>
                                    {term.startServices} - {term.endServices}
                                    <button
                                        onClick={() => {
                                            setSelectedTerm(term); // Ustaw wybrany termin
                                            setShowPopup(true); // Pokaż popup
                                        }}
                                        id="book"
                                    >
                                        Book
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showPopup && (
                <>
                    <div className="popup-overlay" onClick={() => setShowPopup(false)}></div>
                    <div className="popup">
                        <h3>Enter your email:</h3>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={() => {
                                if (!userEmail || !selectedTerm || !selectedOfferId || !selectedEmployeeId || !id) {
                                    alert("Please fill in all the required fields.");
                                    return;
                                }

                                const reservationDateTime = `${selectedDate}T${selectedTerm.startServices}`;

                                const reservationData = {
                                    employeeId: selectedEmployeeId,
                                    offerId: selectedOfferId,
                                    salonId: Number(id),
                                    reservationDateTime: reservationDateTime,
                                    userEmail: userEmail,
                                };

                                axios
                                    .post("http://164.90.243.197:8080/reservation", reservationData)
                                    .then((response) => {
                                        console.log("Reservation successful:", response.data);
                                        alert("Reservation successful!");
                                        setShowPopup(false);
                                        setUserEmail("");
                                    })
                                    .catch((error) => {
                                        console.error("Error creating reservation:", error);
                                        alert("Failed to create reservation. Please try again.");
                                    });
                            }}
                        >
                            Confirm
                        </button>
                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SalonDetails;
