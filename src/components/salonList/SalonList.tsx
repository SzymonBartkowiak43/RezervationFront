import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SalonListCSS.css";
import { getSalons, getSalonImage } from "../../Services/salonService";
import { Salon } from "../../models/Salon";
import header from "../header/Header";

interface Salon {
  id: number;
  salonName: string;
  city: string;
  imageUrl: string | null;
}

const SalonList = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalonsWithImages = async () => {
      try {
        const salonsResponse = await getSalons();
        const fetchedSalons = salonsResponse.data;

        const salonPromises = fetchedSalons.map(async (salon: any) => {
          try {
            const imageResponse = await getSalonImage(salon.id);
            return {
              ...salon,
              imageUrl: imageResponse.data[0]?.imageUrl || null,
            };
          } catch (error) {
            console.error(
              `Error fetching images for salon ${salon.id}:`,
              error
            );
            return { ...salon, imageUrl: null };
          }
        });

        const salonsWithImages = await Promise.all(salonPromises);
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

export default header(SalonList, "Rezerwacje");