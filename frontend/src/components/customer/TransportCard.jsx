import React from 'react';
import '../../styles/customer/TransportCard.css';

const TransportCard = ({ transport, onBookTransport, selected, onSelect }) => {
  return (
    <div className={`transport-option-card ${selected ? 'selected' : ''}`}>
      <div className="transport-header">
        <div className="selection-indicator">
          <input 
            type="radio" 
            checked={selected} 
            onChange={() => onSelect(transport)}
          />
          <h3>{transport.name}</h3>
        </div>
        <div className="transport-badge">
          <span className="availability-badge">Available</span>
        </div>
      </div>

      <div className="transport-details">
        <div className="detail-item">
          <span className="detail-icon">⏱️</span>
          <span>Available 24/7, runs every 30 minutes</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>Pickup from Dickoya Station or Hatton town</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <span>Maximum {transport.capacity} passengers with luggage</span>
        </div>
      </div>

      {selected && (
        <div className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Arrival Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="form-group">
              <label>Arrival Time</label>
              <input type="time" className="form-control" />
            </div>
          </div>
          
        
          
          <div className="form-group">
            <label>Number of Passengers</label>
            <select className="form-control">
              <option>1 Passenger</option>
              <option>2 Passengers</option>
              <option>3 Passengers</option>
              <option>4 Passengers</option>
              <option>5 Passengers</option>
            </select>
          </div>
        </div>
      )}
      
      <button 
        className="book-button"
        onClick={() => onBookTransport(transport)}
      >
        Book Now
      </button>
    </div>
  );
};

export default TransportCard;
