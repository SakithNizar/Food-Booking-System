import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Car, User, Users, ArrowRight, Star, Clock, Shield, Calendar } from 'lucide-react';
import BookingForm from './BookingForm';

function GuestTransportation() {
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransportations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/transportation');
      // Filter to show only active transportation options
      const activeOptions = res.data.filter(option => option.status === 'Active');
      setTransportations(activeOptions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transportation options', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportations();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5f2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-48 mb-6">
            <img src="/public/logo.jpg" alt="Twin Green Salankanda" className="w-full" />
          </div>
          <h1 className="text-3xl font-serif text-brown-700 text-center">
            Transportation Services
          </h1>
          <div className="w-24 h-1 bg-green-600 my-4"></div>
          <p className="text-center text-gray-600 max-w-2xl">
            Experience comfort and luxury with our premium transportation options
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white shadow-md rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/4 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="w-full md:w-3/4 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : transportations.length > 0 ? (
          <div className="space-y-8">
            {transportations.map(option => (
              <div key={option._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Vehicle image/icon */}
                  <div className="w-full md:w-1/3 bg-gradient-to-br from-green-500 to-green-700 p-6 flex items-center justify-center">
                    <div className="bg-white/10 p-6 rounded-full">
                      <Car className="h-20 w-20 text-white" />
                    </div>
                  </div>
                  
                  {/* Right side - Vehicle details */}
                  <div className="w-full md:w-2/3 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <h2 className="text-2xl font-serif text-brown-700">{option.vehicleType}</h2>
                      <div className="flex items-center mt-2 md:mt-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Driver</p>
                          <p className="font-medium">{option.driverName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{option.capacity} passengers</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Availability</p>
                          <p className="font-medium">24/7</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Safety</p>
                          <p className="font-medium">Premium</p>
                        </div>
                      </div>
                    </div>
                    
                    {option.features && option.features.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {option.features.map((feature, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-xs font-medium border border-green-200 bg-green-50 text-brown-700">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100">
                      <div className="mb-4 sm:mb-0">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-brown-700">${option.price || '50'}<span className="text-sm font-normal text-gray-500">/trip</span></p>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/guest/book/${option._id}`)}
                        className="flex items-center justify-center px-6 py-3 rounded-full text-black bg-brown-700 hover:bg-brown-800 
                        transition-colors duration-200 shadow-md hover:shadow-lg"
>
                        <Calendar className="mr-2 h-5 w-5" />
                        Book This Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <Car className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-xl font-serif text-brown-700">No Transportation Available</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              We're currently updating our transportation options. Please check back soon or contact our concierge for assistance.
            </p>
          </div>
        )}

        <Routes>
          <Route path="book/:id" element={<BookingForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default GuestTransportation;