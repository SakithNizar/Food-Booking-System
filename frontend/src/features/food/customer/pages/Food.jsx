import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../../config/axiosConfig";
import FoodCard from "../components/FoodCard";
import logo from "../../../../assets/logo-twingreen.png"; // Adjust if needed

const Food = () => {
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodTime, setFoodTime] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Category");

  const [user, setUser] = useState({}); // Mock user; replace with real auth later
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultProfileImage =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, timeResponse] = await Promise.all([
          axiosInstance.get("/food-categories"),
          axiosInstance.get("/food-times"),
        ]);

        const filteredCategories = categoriesResponse.data.filter(
          (category) => Array.isArray(category.food) && category.food.length > 0
        );

        const filteredTimes = timeResponse.data.filter(
          (time) => Array.isArray(time.food) && time.food.length > 0
        );

        setFoodCategories(filteredCategories);
        setFoodTime(filteredTimes);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const convertTo12HourFormat = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const Navbar = () => (
    <nav className="bg-brown-50 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/main">
              <img src={logo} alt="TwinGreen Logo" className="h-10 w-auto" />
            </Link>
            <span className="text-2xl font-bold text-green-700">TwinGreen</span>
          </div>
          <div className="flex space-x-8 items-center">
            <Link to="/rooms" className="text-brown-800 hover:text-green-700 font-medium">
              Rooms
            </Link>
            <Link to="/booking" className="text-brown-800 hover:text-green-700 font-medium">
              Book Now
            </Link>
            <Link to="/food" className="text-brown-800 hover:text-green-700 font-medium">
              Menu
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/my-bookings" className="text-brown-800 hover:text-green-700 font-medium">
                  My Bookings
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="focus:outline-none"
                  >
                    <img
                      src={user.profileImage || defaultProfileImage}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-green-600 hover:border-green-700"
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setUser(null); // Mock logout
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-white to-lime-100">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
          Twin Green Food Menu
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          {["Category", "Time"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition ${
                selectedTab === tab
                  ? "bg-green-600 text-white shadow"
                  : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
              }`}
            >
              {tab === "Category" ? "Categorize by Type" : "Categorize by Time"}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {selectedTab === "Category"
          ? foodCategories.map((category) => (
              <div
                key={category._id}
                className="mb-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-md p-6"
              >
                <div className="mb-6 border-b pb-2">
                  <h2 className="text-2xl font-bold text-green-700 mb-1">
                    {category.name}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {category.food.map((food) => (
                    <FoodCard key={food._id} food={food} />
                  ))}
                </div>
              </div>
            ))
          : foodTime.map((time) => (
              <div
                key={time._id}
                className="mb-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-md p-6"
              >
                <div className="mb-6 border-b pb-2 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-700 mb-1">
                      {time.name}
                    </h2>
                    <p className="text-gray-600">{time.description}</p>
                  </div>
                  <div className="text-right text-green-800 font-medium">
                    <div>
                      {convertTo12HourFormat(time.startTime)} -{" "}
                      {convertTo12HourFormat(time.endTime)}
                    </div>
                    <div>Rs. {time.price}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {time.food.map((food) => (
                    <FoodCard key={food._id} food={food} />
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Food;
