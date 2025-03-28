import React from 'react';
import '../../styles/customer/BookingModal.css';

const BookingModal = ({ transport, onClose, onConfirm }) => {
  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <h2>Confirm Booking</h2>
        
        <div className="booking-details">
          <p><strong>Vehicle:</strong> {transport.name}</p>
          <p><strong>Driver:</strong> {transport.driver}</p>
          <p><strong>Vehicle Type:</strong> {transport.vehicleType}</p>
          <p><strong>Price:</strong> ${transport.price}</p>
        </div>
        
        <MapView transport={transport} />
        
        <div className="booking-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirm Booking</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
