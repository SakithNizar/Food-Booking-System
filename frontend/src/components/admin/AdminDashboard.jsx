import React, { useState, useEffect } from 'react';
import DashboardHeader from '../common/DashboardHeader';
import ReportControls from './ReportControls';
import StatsCards from './StatsCards';
import BookingTable from './BookingTable';
import VehicleTable from './VehicleTable';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportStats, setReportStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    popularVehicle: 'None'
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = {
      onmessage: (event) => {
        // Mock function to handle incoming booking notifications
        const handleNewBooking = (bookingData) => {
          setBookings(prevBookings => [bookingData, ...prevBookings]);
          // Update stats
          setReportStats(prevStats => ({
            ...prevStats,
            totalBookings: prevStats.totalBookings + 1,
            totalRevenue: prevStats.totalRevenue + bookingData.price,
            upcomingBookings: prevStats.upcomingBookings + 1
          }));
        };
      }
    };

    return () => {
      // In a real implementation: socket.close()
    };
  }, []);

  // Fetch data
  useEffect(() => {
    // This would be API calls in a real application
    const fetchData = () => {
      
      const mockBookings = [
        { id: 1, guestName: 'Alice Johnson', roomNumber: '101', vehicleId: 1, vehicleName: 'Hotel Shuttle Service', driver: 'Resort Staff', date: '2025-03-20', price: 0, status: 'completed' },
        { id: 2, guestName: 'Bob Smith', roomNumber: '204', vehicleId: 2, vehicleName: 'Tuk Tuk Ride', driver: 'Local Driver', date: '2025-03-27', price: 15, status: 'upcoming' },
        { id: 3, guestName: 'Carol Williams', roomNumber: '315', vehicleId: 3, vehicleName: 'Private Taxi', driver: 'Professional', date: '2025-03-28', price: 25, status: 'upcoming' },
        { id: 4, guestName: 'David Brown', roomNumber: '127', vehicleId: 4, vehicleName: 'Self-Drive Rental', driver: 'Self-drive', date: '2025-03-29', price: 45, status: 'upcoming' },
        { id: 5, guestName: 'Eve Davis', roomNumber: '210', vehicleId: 5, vehicleName: 'Airport Transfer', driver: 'Professional', date: '2025-03-25', price: 35, status: 'completed' }
      ];

     
      const mockVehicles = [
        { id: 1, name: 'Hotel Shuttle Service', type: 'Van', driver: 'Resort Staff', capacity: 8, bookings: 15, revenue: 0, status: 'active' },
        { id: 2, name: 'Tuk Tuk Ride', type: 'Tuk Tuk', driver: 'Local Driver', capacity: 3, bookings: 10, revenue: 150, status: 'active' },
        { id: 3, name: 'Private Taxi', type: 'Sedan', driver: 'Professional', capacity: 4, bookings: 12, revenue: 300, status: 'active' },
        { id: 4, name: 'Self-Drive Rental', type: 'Various', driver: 'Self-drive', capacity: 'Varies', bookings: 8, revenue: 360, status: 'active' },
        { id: 5, name: 'Airport Transfer', type: 'Van/Sedan', driver: 'Professional', capacity: 4, bookings: 14, revenue: 490, status: 'active' }
      ];

      setBookings(mockBookings);
      setVehicles(mockVehicles);
    };

    fetchData();
  }, []);

  // Filter bookings based on date range
  useEffect(() => {
    const filtered = bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
    setFilteredBookings(filtered);
  }, [bookings, dateRange]);

  // Calculate report statistics
  useEffect(() => {
    if (filteredBookings.length === 0) {
      setReportStats({
        totalBookings: 0,
        totalRevenue: 0,
        completedBookings: 0,
        upcomingBookings: 0,
        popularVehicle: 'None'
      });
      return;
    }

    const stats = {
      totalBookings: filteredBookings.length,
      totalRevenue: filteredBookings.reduce((sum, booking) => sum + booking.price, 0),
      completedBookings: filteredBookings.filter(booking => booking.status === 'completed').length,
      upcomingBookings: filteredBookings.filter(booking => booking.status === 'upcoming').length,
      popularVehicle: (() => {
        const vehicleCounts = {};
        filteredBookings.forEach(booking => {
          vehicleCounts[booking.vehicleName] = (vehicleCounts[booking.vehicleName] || 0) + 1;
        });
        let maxCount = 0;
        let popularVehicle = 'None';
        for (const [vehicle, count] of Object.entries(vehicleCounts)) {
          if (count > maxCount) {
            maxCount = count;
            popularVehicle = vehicle;
          }
        }
        return popularVehicle;
      })()
    };
    setReportStats(stats);
  }, [filteredBookings]);

  const handleExportCSV = () => {
    alert('Exporting report data as CSV...');
  };

  const handleExportPDF = () => {
    alert('Exporting report data as PDF...');
  };

  // Function to handle new bookings from customer dashboard
  const handleNewBookingFromCustomer = (bookingData) => {
    // Add the new booking to the bookings list
    const newBooking = {
      id: bookings.length + 1,
      guestName: bookingData.guestName,
      roomNumber: bookingData.roomNumber,
      vehicleId: bookingData.vehicleId,
      vehicleName: bookingData.vehicleName,
      driver: bookingData.driver,
      date: bookingData.date,
      price: bookingData.price,
      status: 'upcoming',
      isNew: true // Flag to highlight new bookings
    };
    setBookings(prevBookings => [newBooking, ...prevBookings]);
    
    // Update stats
    setReportStats(prevStats => ({
      ...prevStats,
      totalBookings: prevStats.totalBookings + 1,
      totalRevenue: prevStats.totalRevenue + bookingData.price,
      upcomingBookings: prevStats.upcomingBookings + 1
    }));
  };

  return (
    <div className="admin-dashboard">
      <DashboardHeader title="Hotel Transportation Services Dashboard" />
      
      <div className="dashboard-controls">
        <ReportControls 
          reportType={reportType} 
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <div className="export-buttons">
          <button onClick={handleExportCSV}>Export CSV</button>
          <button onClick={handleExportPDF}>Export PDF</button>
        </div>
      </div>
      
      <StatsCards stats={reportStats} />
      
      <div className="data-tables">
        <div className="table-section">
          <h2>Transportation Bookings</h2>
          <BookingTable bookings={filteredBookings} />
        </div>
        
        <div className="table-section">
          <h2>Transportation Options</h2>
          <VehicleTable vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
