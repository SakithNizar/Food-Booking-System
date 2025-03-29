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

        // Ensure 'food' is always an array to prevent errors
        const filteredCategories = categoriesResponse.data.map((category) => ({
          ...category,
          food: Array.isArray(category.food) ? category.food : [], // Ensure 'food' is an array
        }));

        const filteredTimes = timeResponse.data.map((time) => ({
          ...time,
          food: Array.isArray(time.food) ? time.food : [], // Ensure 'food' is an array
        }));

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
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="p-6">
      <div className="w-full flex justify-center gap-20">
        <div
          onClick={() => setSelectedTab("Category")}
          className={`text-center px-4 border text-xl font-bold text-gray-900 pb-2 rounded-lg border-b-3 border-gray-800 transition duration-500 ease-in-out cursor-pointer ${
            selectedTab === "Category" && "bg-blue-400 border-blue-500"
          }`}
        >
          Categorize by Type
        </div>
        <div
          onClick={() => setSelectedTab("Time")}
          className={`text-center px-4 border text-xl font-bold text-gray-900 pb-2 rounded-lg border-b-3 border-gray-800 transition duration-500 ease-in-out cursor-pointer ${
            selectedTab === "Time" && "bg-blue-400 border-blue-500"
          }`}
        >
          Categorize by Time
        </div>
      </div>

      {selectedTab === "Category"
        ? foodCategories.map((category) => (
            <div key={category._id} className="mb-10">
              {/* Category Title */}
              <div className="mb-8 border-b-2 pb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p>{category.description}</p>
              </div>

              {/* Food Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {category.food?.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            </div>
          ))
        : foodTime.map((time) => (
            <div key={time._id} className="mb-10">
              {/* Time Title */}
              <div className="mb-8 border-b-2 pb-2 flex justify">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {time.name}
                  </h2>
                  <p>{time.description}</p>
                </div>
                <div className="flex-1 flex flex-col justify-end items-end pr-10 font-bold">
                  <div>
                    <span>{convertTo12HourFormat(time.startTime)}</span> -{" "}
                    <span>{convertTo12HourFormat(time.endTime)}</span>
                  </div>
                  <div>Rs. {time.price}</div>
                </div>
              </div>

              {/* Food Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {time.food?.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Food;
