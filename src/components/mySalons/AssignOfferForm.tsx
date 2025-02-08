import React, {useState} from "react";
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
            setError("Please chose an offer");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.patch(
                "http://164.90.190.165:8080/employees/add-offer",
                {
                    offerId: selectedOfferId,
                    employeeId: employeeId,
                }
            );

            if (response.status === 200) {
                onSuccess();
                setSelectedOfferId("");
            } else {
                setError("There was a problem when assigning an offer");
            }
        } catch (err) {
            console.error("Error when assigning an offer:", err);
            setError("This employee is already assigned to this offer!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        /* AssignOfferForm.css */
:root {
    --accent-color: #e76f51;
    --background-dark: #3d3c3c;
    --text-light: #f8f9fa;
    --text-muted: #a0aec0;
    --error-color: #ff4444;
}

.assign-offer-form {
    max-width: 500px;
    margin: 1rem 0;
    padding: 1.5rem;
    background: #4a4a4a;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-light);
    font-weight: 500;
}

.form-select {
    width: 100%;
    padding: 0.8rem;
    background: #3d3c3c;
    border: 2px solid #5a5a5a;
    border-radius: 8px;
    color: var(--text-light);
    font-size: 1rem;
    transition: all 0.3s ease;
    appearance: none;
}

.form-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.2);
}

.submit-button {
    width: 100%;
    padding: 1rem;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.submit-button:hover:not(:disabled) {
    background: #d45d3f;
    transform: translateY(-2px);
}

.submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading-text {
    display: inline-block;
    padding-left: 1.5rem;
    position: relative;
}

.loading-text::after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.error-message {
    margin-top: 1rem;
    padding: 0.8rem;
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid var(--error-color);
    border-radius: 6px;
    color: var(--error-color);
    font-size: 0.9rem;
}

@keyframes spin {
    to {
        transform: translateY(-50%) rotate(360deg);
    }
}

@media (max-width: 768px) {
    .assign-offer-form {
        padding: 1rem;
    }

    .form-select {
        font-size: 0.9rem;
    }

    .submit-button {
        padding: 0.8rem;
        font-size: 0.9rem;
    }
}
      `}</style>

            <form onSubmit={handleSubmit} className="assign-offer-form">
                <div className="form-group">
                    <label className="form-label">Select offer:</label>
                    <select
                        className="form-select"
                        value={selectedOfferId}
                        onChange={(e) => setSelectedOfferId(Number(e.target.value))}
                        disabled={loading}
                    >
                        <option value="">-- Select from the list --</option>
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
                        <span className="loading-text">Assignment...</span>
                    ) : (
                        "Assign offer"
                    )}
                </button>

                {error && <div className="error-message">{error}</div>}
            </form>
        </>
    );
};

export default AssignOfferForm;