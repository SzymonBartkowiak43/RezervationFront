import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import header from "../header/Header";
import "./MySalonsPage.css";
import { FaCity, FaMapMarkerAlt, FaTag, FaPlusCircle, FaSadTear } from "react-icons/fa";

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
    const [loading, setLoading] = useState(true);
    const userEmail = localStorage.getItem("email") || "";
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://164.90.190.165:8080/owner/salons?email=${encodeURIComponent(userEmail)}`)
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then((data) => {
                setSalons(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching salons:", error);
                setLoading(false);
            });
    }, [userEmail]);

    const handleSalonClick = (salonId: string) => {
        navigate(`/owner/salon/${salonId}?email=${encodeURIComponent(userEmail)}`);
    };

    const handleCreateNew = () => {
        navigate("/create-salon");
    };

    return (
        <div className="my-salons-container">
            <div className="header-section">
                <h1 className="title">
                    <FaCity className="title-icon" /> My salons
                </h1>
                <button className="create-button" onClick={handleCreateNew}>
                    <FaPlusCircle /> New Salon
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Salon loading...</p>
                </div>
            ) : salons.length > 0 ? (
                <div className="salon-grid">
                    {salons.map((salon) => (
                        <div
                            key={salon.id}
                            className="salon-card"
                            onClick={() => handleSalonClick(salon.id)}
                        >
                            <div className="card-header">
                                <h2 className="salon-name">{salon.salonName}</h2>
                                <span className="salon-category">
                                    <FaTag /> {salon.category}
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="salon-address">
                                    <FaMapMarkerAlt />
                                    <span className="salon-name-span">{salon.street} {salon.number}</span>
                                    <span>{salon.zipCode} {salon.city}</span>
                                </p>
                            </div>
                            <div className="card-hover-effect"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-salons">
                    <FaSadTear className="sad-icon" />
                    <p>No salons found</p>
                    <button className="create-button" onClick={handleCreateNew}>
                        <FaPlusCircle /> Create your first salon
                    </button>
                </div>
            )}
        </div>
    );
};

export default header(MySalonsPage, "Rezerwacje");