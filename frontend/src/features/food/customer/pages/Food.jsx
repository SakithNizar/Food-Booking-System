import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../config/axiosConfig";
import FoodCard from "../components/FoodCard";

const Food = () => {
  const [foodCategories, setFoodCategories] = useState([]);
  const [foodTime, setFoodTime] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Category");

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

  const convertTo12HourFormat = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-white to-lime-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
          Twin Green Food Menu
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          {["Category", "Time"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition 
                ${
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
