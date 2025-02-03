import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import header from "../header/Header";
import "./MySalonsPage.css";

interface SalonWithIdDto {
    id: string;
    salonName: string;
    category: string;
    city: string;
    zipCode: string;
    street: string;
    number: string;
    userId: string;
}

const MySalonsPage: React.FC = () => {
    const [salons, setSalons] = useState<SalonWithIdDto[]>([]);
    const userEmail = localStorage.getItem("email") || "";
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/owner/salons?email=${encodeURIComponent(userEmail)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setSalons(data);
            })
            .catch((error) => {
                console.error("Error fetching salons:", error);
            });
    }, [userEmail]);

    const handleSalonClick = (salonId: string) => {
        navigate(`/owner/salon/${salonId}?email=${encodeURIComponent(userEmail)}`);
    };

    return (
        <div className="my-salons-container">
            <h1 className="title">My Salons</h1>
            {salons.length > 0 ? (
                <ul className="salon-list">
                    {salons.map((salon) => (
                        <li key={salon.id} className="salon-item" onClick={() => handleSalonClick(salon.id)}>
                            <h2 className="salon-name">{salon.salonName}</h2>
                            <p className="salon-category">{salon.category}</p>
                            <p className="salon-address">
                                {salon.street} {salon.number}, {salon.city}, {salon.zipCode}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-salons">No salons found.</p>
            )}
        </div>
    );
};

export default header(MySalonsPage, "Rezerwacje");
