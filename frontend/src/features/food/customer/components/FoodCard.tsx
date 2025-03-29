import React from "react";

const FoodCard = ({ food }) => {
  if (!food) {
    return <div className="p-4 text-red-500">Food data not available</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transform hover:scale-105 transition duration-300">
      {/* Food Image */}
      <div className="h-40 w-full">
        <img
          src={food.picture || "/default-food.jpg"} // Use default image if `food.picture` is missing
          alt={food.name || "Unnamed Food"}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Food Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {food.name || "Unnamed Food"}
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          {food.description?.length > 80
            ? food.description.substring(0, 80) + "..."
            : food.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;
