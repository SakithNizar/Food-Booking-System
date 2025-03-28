import React, { useState, useEffect } from 'react';
import TransportList from './TransportList';
import SearchBar from './SearchBar';
import DashboardHeader from '../common/DashboardHeader';
import '../../styles/customer/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [transportOptions, setTransportOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  // Fetch transport options
  useEffect(() => {
    // This would be an API call in a real application
    const fetchTransportOptions = () => {
      const mockData = [
        {
          id: 1,
          name: 'Hotel Shuttle Service',
          description: 'Convenient shuttle service from airport/Railway-Station to our resort',
          availability: 'Available 24/7, runs every 30 minutes',
          pickup: 'Pickup from Salankanda Resort or Palmela Station',
          capacity: 'Maximum 8 passengers with luggage',
          vehicleType: 'Van',
          price: 0
        },

        {
          id: 2,
          name: 'Tuk Tuk Ride',
          description: 'Fun and affordable tuk tuk rides for short-distance travel',
          availability: 'Available 7 AM to 9 PM',
          pickup: 'Available at main streets and tourist areas',
          capacity: 'Maximum 3 passengers with small luggage',
          vehicleType: 'Tuk Tuk',
          price: 8
        },
        {
          id: 3,
          name: 'Private Car Transfer',
          description: 'Personalized private car transfer for a comfortable journey',
          availability: 'Available on request, booking required',
          pickup: 'Pickup from any location within city limits',
          capacity: 'Maximum 4 passengers with luggage',
          vehicleType: 'Sedan',
          price: 50
        },

        {
          id: 4,
          name: 'Shared Minibus Service',
          description: 'Affordable shared minibus service for group travelers',
          availability: 'Operates daily from 6 AM to 10 PM',
          pickup: 'Multiple pickup points within the city',
          capacity: 'Maximum 12 passengers with luggage',
          vehicleType: 'Minibus',
          price: 10
        },
        {
          id: 5,
          name: 'Bike Rental Service',
          description: 'Rent a bike for quick and flexible transport',
          availability: 'Available 6 AM to 8 PM',
          pickup: 'Pickup from resort rental station',
          capacity: 'Single rider only',
          vehicleType: 'Bicycle',
          price: 5
        },
        
      ];
      setTransportOptions(mockData);
      setFilteredOptions(mockData);
      setSelectedOption(mockData[0]);
    };
    fetchTransportOptions();
  }, []);

  // Filter transport options based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(transportOptions);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = transportOptions.filter(option => {
        return (
          option.name.toLowerCase().includes(lowercasedQuery) ||
          option.description.toLowerCase().includes(lowercasedQuery) ||
          option.availability.toLowerCase().includes(lowercasedQuery) ||
          option.pickup.toLowerCase().includes(lowercasedQuery) ||
          option.capacity.toLowerCase().includes(lowercasedQuery)
        );
      });
      setFilteredOptions(filtered);
    }
  }, [searchQuery, transportOptions]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className="customer-dashboard">
      <DashboardHeader title="Hotel Transportation Services" />
      
      <div className="dashboard-content">
        <SearchBar 
          keyword={searchQuery} 
          onChange={handleSearchChange} 
        />
        <TransportList 
          transportOptions={filteredOptions} 
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
