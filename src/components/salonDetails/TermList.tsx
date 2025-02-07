import React from "react";
import { Term } from "../../models/Term";
import "./TermList.css";

interface TermListProps {
  terms: Term[];
  onTermSelect: (term: Term) => void;
}

const TermList: React.FC<TermListProps> = ({terms, onTermSelect}) => {
    if (terms.length === 0) {
        return <p>No available terms for this selection.</p>;
    }

    return (
        <div className="term-list">
            <h3>Available Terms</h3>
            {terms.length === 0 ? (
                <p className="no-terms">No available terms for this selection.</p>
            ) : (
                <ul>
                    {terms.map((term, index) => (
                        <li key={index}>
          <span>
                    {term.startServices.slice(0, 5)} - {term.endServices.slice(0, 5)}
          </span>

                            <button className="small-button" onClick={() => onTermSelect(term)}>
                                Book
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TermList;
