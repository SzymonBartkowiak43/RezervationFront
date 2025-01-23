import React from "react";
import { Offer } from "../../models/Offer";

interface OfferSelectorProps {
  offers: Offer[];
  selectedOfferId: number | null;
  onOfferSelect: (offerId: number) => void;
}

const OfferSelector: React.FC<OfferSelectorProps> = ({
  offers,
  selectedOfferId,
  onOfferSelect,
}) => {
  return (
    <div>
      <h3>Select a Service</h3>
      <select
        value={selectedOfferId ?? ""}
        onChange={(e) => onOfferSelect(Number(e.target.value))}
      >
        <option value="">Select an offer</option>
        {offers.map((offer) => (
          <option key={offer.id} value={offer.id}>
            {offer.name} - {offer.price}$
          </option>
        ))}
      </select>
    </div>
  );
};

export default OfferSelector;
