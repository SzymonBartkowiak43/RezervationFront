import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SalonListCSS.css";

const SalonList = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalonsWithImages = async () => {
            try {
                // Pobierz wszystkie salony
                const salonsResponse = await axios.get("http://164.90.243.197:8080/salons");
                const fetchedSalons = salonsResponse.data;

                // Pobierz obrazki dla każdego salonu równolegle
                const salonPromises = fetchedSalons.map(async (salon) => {
                    try {
                        const imageResponse = await axios.get(`http://164.90.243.197:8080/salons/image/${salon.id}`);
                        return {
                            ...salon,
                            imageUrl: imageResponse.data[0]?.imageUrl || null, // Pobierz URL pierwszego obrazka
                        };
                    } catch (error) {
                        console.error(`Error fetching images for salon ${salon.id}:`, error);
                        return { ...salon, imageUrl: null }; // Brak obrazka ustaw na null
                    }
                });

                // Poczekaj, aż wszystkie promisy się wykonają
                const salonsWithImages = await Promise.all(salonPromises);

                // Ustaw dane w stanie
                setSalons(salonsWithImages);
            } catch (error) {
                console.error("Error fetching salons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalonsWithImages();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="salon-list">
            {salons.length === 0 ? (
                <p>No salons available.</p>
            ) : (
                salons.map((salon) => (
                    <div key={salon.id} className="salon-card">
                        <h3>{salon.salonName}</h3>
                        <p>{salon.city}</p>
                        {/* Wyświetlanie zdjęcia, jeśli jest dostępne */}
                        {salon.imageUrl ? (
                            <img
                                src={salon.imageUrl}
                                alt={`${salon.salonName} thumbnail`}
                                className="salon-image"
                            />
                        ) : (
                            <p>No image available</p>
                        )}
                        <Link to={`/salons/${salon.id}`}>See Details</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default SalonList;
