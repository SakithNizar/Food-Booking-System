import React from 'react';
import '../../styles/admin/StatsCards.css';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon bookings-icon">📊</div>
        <div className="stat-content">
          <h3>Total Bookings</h3>
          <p className="stat-value">{stats.totalBookings}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon revenue-icon">💰</div>
        <div className="stat-content">
          <h3>Total Revenue</h3>
          <p className="stat-value">${stats.totalRevenue}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon completed-icon">✅</div>
        <div className="stat-content">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completedBookings}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon upcoming-icon">🔜</div>
        <div className="stat-content">
          <h3>Upcoming</h3>
          <p className="stat-value">{stats.upcomingBookings}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon popular-icon">🌟</div>
        <div className="stat-content">
          <h3>Popular Option</h3>
          <p className="stat-value">{stats.popularVehicle}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
