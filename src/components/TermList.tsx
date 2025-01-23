import React from "react";
import { Term } from "../models/Term";

interface TermListProps {
  terms: Term[];
  onTermSelect: (term: Term) => void;
}

const TermList: React.FC<TermListProps> = ({ terms, onTermSelect }) => {
  if (terms.length === 0) {
    return <p>No available terms for this selection.</p>;
  }

  return (
    <div>
      <h3>Available Terms</h3>
      <ul>
        {terms.map((term, index) => (
          <li key={index}>
            {term.startServices} - {term.endServices}
            <button onClick={() => onTermSelect(term)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TermList;
