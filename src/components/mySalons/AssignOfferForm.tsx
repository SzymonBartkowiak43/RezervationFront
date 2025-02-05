import React, { useState } from "react";
import axios from "axios";
import "./AssignOfferForm.css";

interface Offer {
    id: number;
    name: string;
}

interface AssignOfferFormProps {
    employeeId: number;
    availableOffers: Offer[];
    onSuccess: () => void;
}

const AssignOfferForm: React.FC<AssignOfferFormProps> = ({
                                                             employeeId,
                                                             availableOffers,
                                                             onSuccess,
                                                         }) => {
    const [selectedOfferId, setSelectedOfferId] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedOfferId === "") {
            setError("Proszę wybrać ofertę");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.patch(
                "http://localhost:8080/employees/add-offer",
                {
                    offerId: selectedOfferId,
                    employeeId: employeeId,
                }
            );

            if (response.status === 200) {
                onSuccess();
                setSelectedOfferId("");
            } else {
                setError("Wystąpił problem podczas przypisywania oferty");
            }
        } catch (err) {
            console.error("Błąd podczas przypisywania oferty:", err);
            setError("Wystąpił błąd podczas przypisywania oferty");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="assign-offer-form">
            <div className="form-group">
                <label className="form-label">Wybierz ofertę:</label>
                <select
                    className="form-select"
                    value={selectedOfferId}
                    onChange={(e) => setSelectedOfferId(Number(e.target.value))}
                    disabled={loading}
                >
                    <option value="">-- Wybierz z listy --</option>
                    {availableOffers.map((offer) => (
                        <option key={offer.id} value={offer.id}>
                            {offer.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={loading}
            >
                {loading ? (
                    <span className="loading-text">Przypisywanie...</span>
                ) : (
                    "Przypisz ofertę"
                )}
            </button>

            {error && <div className="error-message">{error}</div>}
        </form>
    );
};

export default AssignOfferForm;