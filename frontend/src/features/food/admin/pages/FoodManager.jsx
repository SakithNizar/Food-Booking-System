import React from "react";
import CategoryManagement from "../components/CategorySection";
import BuffetTimeManagement from "../components/FoodTimeSection";
import FoodItemsSection from "../components/FoodItemsSection";

const FoodManager = () => {
  return (
    <div className="admin-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Food Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <CategoryManagement />
        <BuffetTimeManagement />
      </div>
      <FoodItemsSection />
    </div>
  );
};

export default FoodManager;
