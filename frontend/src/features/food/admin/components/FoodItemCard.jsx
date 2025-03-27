import React from "react";

const FoodItemCard = ({ food }) => {
  return (
    <div
      onClick={() => console.log("Card clciked")}
      className="food-item-card p-4 bg-white shadow rounded-lg cursor-pointer hover:scale-105 transition-transform"
    >
      <img
        src={food.picture}
        alt={food.name}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <div className="p-2">
        <h3 className="text-lg font-semibold">{food.name}</h3>
      </div>
    </div>
  );
};

export default FoodItemCard;
