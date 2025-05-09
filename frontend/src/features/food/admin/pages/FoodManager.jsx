import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import CategoryManagement from "../components/CategorySection";
import BuffetTimeManagement from "../components/FoodTimeSection";
import FoodItemsSection from "../components/FoodItemsSection";

const FoodManager = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/admin/report");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-white to-lime-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-green-700 text-center md:text-left">
            Food Management System
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReportClick}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow hover:bg-red-600 transition"
            >
              <FaFilePdf size={18} />
              <span className="hidden md:inline">Generate Report</span>
            </button>
            <button
              onClick={() => navigate("/food")}
              className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition"
            >
              View Menu
            </button>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-md p-6">
            <CategoryManagement />
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-md p-6">
            <BuffetTimeManagement />
          </div>
        </div>

        {/* Food Items Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-md p-6">
          <FoodItemsSection />
        </div>
      </div>
    </div>
  );
};

export default FoodManager;
