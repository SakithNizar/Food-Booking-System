import React from 'react';
import '../../styles/admin/DataTable.css';

const VehicleTable = ({ vehicles }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Driver</th>
            <th>Capacity</th>
            <th>Total Bookings</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.name}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.driver}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.bookings}</td>
                <td>${vehicle.revenue}</td>
                <td>
                  <span className={`status-badge ${vehicle.status}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn toggle">
                    {vehicle.status === 'active' ? 'Disable ' : ' Enable'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No transportation options found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
