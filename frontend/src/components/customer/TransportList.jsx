import React from 'react';
import TransportCard from './TransportCard';
import '../../styles/customer/TransportList.css';

const TransportList = ({ transportOptions, selectedOption, setSelectedOption }) => {
  return (
    <div className="transportation-options">
      <h2>Transportation Options</h2>
      <p className="subtitle">Select your preferred method of transportation to and from Twin Green Salankanda</p>
      
      {transportOptions.length > 0 ? (
        <div className="transport-options-list">
          {transportOptions.map(option => (
            <TransportCard 
              key={option.id}
              transport={option}
              selected={selectedOption && selectedOption.id === option.id}
              onSelect={setSelectedOption}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No transportation options match your search. Please try different keywords.</p>
        </div>
      )}
    </div>
  );
};

export default TransportList;
