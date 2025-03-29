import React from "react";

const FoodCard = ({ food }) => {
  return (
    <div
      key={food._id}
      className="bg-white shadow-md rounded-xl overflow-hidden transform hover:scale-105 transition duration-300"
    >
      {/* Food Image */}
      <div className="h-40 w-full">
        <img
          src={food.picture}
          alt={food.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Food Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
        <p className="text-gray-600 text-sm mt-2">
          {food.description.length > 80
            ? food.description.substring(0, 80) + "..."
            : food.description}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;
