import React from 'react';
import '../../styles/admin/DataTable.css';

const BookingTable = ({ bookings }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.guestName}</td>
                <td>{booking.roomNumber}</td>
                <td>{booking.vehicleName}</td>
                <td>{booking.driver}</td>
                <td>{booking.date}</td>
                <td>${booking.price}</td>
                <td className={`status-${booking.status}`}>{booking.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">No bookings found for the selected period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;