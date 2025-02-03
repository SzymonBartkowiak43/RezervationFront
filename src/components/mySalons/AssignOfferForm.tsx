import React, { useState } from "react";
import axios from "axios";

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
            setError("Wybierz ofertę");
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
            } else {
                setError("Wystąpił problem podczas przypisywania oferty.");
            }
        } catch (err) {
            console.error("AxiosError", err);
            setError("Wystąpił błąd podczas przypisywania oferty.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="assign-offer-form">
            <label>Przypisz ofertę:</label>
            <select
                value={selectedOfferId}
                onChange={(e) => setSelectedOfferId(Number(e.target.value))}
            >
                <option value="">Wybierz ofertę</option>
                {availableOffers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                        {offer.name}
                    </option>
                ))}
            </select>
            <button type="submit" disabled={loading}>
                {loading ? "Przypisywanie..." : "Przypisz ofertę"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default AssignOfferForm;
