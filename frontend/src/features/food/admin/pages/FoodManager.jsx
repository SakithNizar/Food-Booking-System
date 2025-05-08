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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Food Management System
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReportClick}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              <FaFilePdf size={18} />
              <span className="hidden md:inline">Generate Report</span>
            </button>
            <button
              onClick={() => navigate("/food")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              View Menu
            </button>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CategoryManagement />
          <BuffetTimeManagement />
        </div>

        {/* Food Items Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <FoodItemsSection />
        </div>
      </div>
    </div>
  );
};

export default FoodManager;
