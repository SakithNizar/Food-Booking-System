import React from 'react';
import '../../styles/customer/SearchFilters.css';
import '../../components/customer/SearchBar.jsx';

const SearchFilters = ({ searchQuery, setSearchQuery, filters, setFilters, passengerCount, setPassengerCount }) => {
  return (
    <div className="search-filters">
      <h1>Transportation Options</h1>
      <p className="subtitle">Select your preferred method of transportation to and from Twin Green Salankanda</p>
      
      <div className="date-selection">
        <div className="date-field">
          <label>Arrival Date</label>
          <div className="date-input-container">
            <input type="date" name="arrivalDate" />
            <input type="time" name="arrivalTime" />
          </div>
        </div>
        
        <div className="date-field">
          <label>Arrival Time</label>
          <div className="time-input-container">
            <input type="time" name="departureTime" />
          </div>
        </div>
      </div>
      
      <div className="passenger-selection">
        <label>Number of Passengers</label>
        <select 
          value={passengerCount} 
          onChange={(e) => setPassengerCount(e.target.value)}
          className="passenger-select"
        >
          <option value="1">1 Passenger</option>
          <option value="2">2 Passengers</option>
          <option value="3">3 Passengers</option>
          <option value="4">4 Passengers</option>
          <option value="5">5 Passengers</option>
          <option value="6">6 Passengers</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
