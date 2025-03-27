import React, { useState } from "react";

const FilterAndSearch = ({
  onFilterChange,
  onSearch,
  categories,
  buffetTimes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="filter-and-search flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search food items..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2 border border-gray-300 rounded-lg"
      />
      <select
        onChange={(e) => onFilterChange("category", e.target.value)}
        className="p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Filter by Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => onFilterChange("time", e.target.value)}
        className="p-2 border border-gray-300 rounded-lg"
      >
        <option value="">Filter by Buffet Time</option>
        {buffetTimes.map((time) => (
          <option key={time._id} value={time._id}>
            {time.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterAndSearch;
