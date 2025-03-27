import React, { useState, useEffect } from "react";
import FilterAndSearch from "./FilterAndSearch";
import axiosInstance from "../../../../config/axiosConfig";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSave, FaCamera } from "react-icons/fa";
import Modal from "../../../../components/Modal";

const FoodItemsSection = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [buffetTimes, setBuffetTimes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewFoodItem, setViewFoodItem] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    picture: "",
    category: [],
    time: [],
  });

  useEffect(() => {
    fetchFoodItems();
    fetchCategories();
    fetchBuffetTimes();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axiosInstance.get("/foods");
      setFoodItems(Array.isArray(response.data) ? response.data : []);
      setFilteredFoodItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/food-categories");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBuffetTimes = async () => {
    try {
      const response = await axiosInstance.get("/food-times");
      setBuffetTimes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching buffet times:", error);
    }
  };

  const handleFilterChange = (filterType, filterValue) => {
    let filteredItems = foodItems;

    if (filterType === "category" && filterValue) {
      filteredItems = filteredItems.filter((item) =>
        item.category.some((cat) => cat._id === filterValue)
      );
    }

    if (filterType === "time" && filterValue) {
      filteredItems = filteredItems.filter((item) =>
        item.time.some((t) => t._id === filterValue)
      );
    }

    setFilteredFoodItems(filteredItems);
  };

  const handleSearch = (searchTerm) => {
    const filteredItems = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoodItems(filteredItems);
  };

  const openModal = (foodItem = null) => {
    setSelectedFoodItem(foodItem);
    if (foodItem) {
      setIsEditing(true);

      const { name, description, picture, category, time } = foodItem;

      const formattedData = {
        name,
        description,
        picture,
        category: category.map((cat) => cat._id), // Extracting only the IDs
        time: time.map((t) => t._id), // Extracting only the IDs
      };

      console.log("foodItem", formattedData);
      setFormData(formattedData);
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        description: "",
        picture: "",
        category: [],
        time: [],
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFoodItem(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleViewModal = (foodItem = null) => {
    console.log("toggleViewModal called with:", foodItem);
    setSelectedFoodItem(foodItem);
    setViewFoodItem(!viewFoodItem);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(`/foods/${selectedFoodItem._id}`, formData);
        setFoodItems(
          foodItems.map((item) =>
            item._id === selectedFoodItem._id ? formData : item
          )
        );
      } else {
        console.log("formData", formData);
        const response = await axiosInstance.post("/foods", formData);
        console.log("response", response.data);
        setFoodItems([...foodItems, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving food item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/foods/${id}`);
      setFoodItems(foodItems.filter((item) => item._id !== id));
      toggleViewModal();
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataPic = new FormData();
      formDataPic.append("image", file);
      formDataPic.append("upload_preset", "catering_preset"); // Ensure this is correct

      try {
        const response = await axiosInstance.post(`/upload`, formDataPic, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image uploaded:", response.data.imageUrl);
        setFormData((prev) => ({ ...prev, picture: response.data.imageUrl }));
        console.log("formData", formData);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="food-items-section container mx-auto p-4  min-h-[50vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Food Items</h2>
        <div className="flex items-center gap-4">
          <FilterAndSearch
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            categories={categories}
            buffetTimes={buffetTimes}
          />
          <button
            onClick={() => openModal()}
            className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full shadow-md cursor-pointer"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredFoodItems.length != 0 ? (
          filteredFoodItems.map((food) => (
            <div
              key={food._id}
              onClick={() => toggleViewModal(food)}
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
          ))
        ) : (
          <div className="h-32 w-[50vw] flex justify-center items-center">
            <div className="w-fit h-fit">No Food Available</div>
          </div>
        )}
      </div>
      {/* Modal for adding or editing food items */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit Food Item" : "Add Food Item"}
      >
        <div className="p-4">
          {/* Image Upload */}
          <label className="block mt-4 mb-2 text-sm font-bold">Picture</label>
          <div
            className="w-40 h-40 relative cursor-pointer"
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {formData.picture ? (
              <img
                src={formData.picture}
                alt="Preview"
                className="w-40 h-40 object-cover rounded"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                <FaCamera size={24} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
          </div>
          <label className="block mb-2 mt-4 text-sm font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter food name"
            required
          />

          <label className="block mt-4 mb-2 text-sm font-bold">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter description"
            required
          />

          {/* Category Multi-Selection */}
          <label className="block mt-4 mb-2 text-sm font-bold">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={cat._id}
                  checked={formData.category.includes(cat._id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      category: prev.category.includes(value)
                        ? prev.category.filter((id) => id !== value)
                        : [...prev.category, value],
                    }));
                  }}
                  className="mr-2"
                />
                {cat.name}
              </label>
            ))}
          </div>

          {/* Time Multi-Selection */}
          <label className="block mt-4 mb-2 text-sm font-bold">Time</label>
          <div className="grid grid-cols-2 gap-2">
            {buffetTimes.map((time) => (
              <label key={time._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={time._id}
                  checked={formData.time.includes(time._id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      time: prev.time.includes(value)
                        ? prev.time.filter((id) => id !== value)
                        : [...prev.time, value],
                    }));
                  }}
                  className="mr-2"
                />
                {time.name}
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave />
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for viewing food item details */}
      {selectedFoodItem && viewFoodItem && (
        <Modal
          isOpen={viewFoodItem}
          onClose={toggleViewModal}
          title={"Hotel_Name"}
        >
          <div className="p-4">
            {/* Food Image */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-3">
                <button
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                  onClick={() => openModal(selectedFoodItem)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                  onClick={() => handleDelete(selectedFoodItem._id)}
                >
                  <FaTrash size={18} />
                </button>
              </div>
              <img
                src={selectedFoodItem.picture}
                alt={selectedFoodItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black/50 text-white text-center w-full py-2">
                {selectedFoodItem.name}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-4 text-lg leading-relaxed">
              {selectedFoodItem.description}
            </p>

            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Categories
              </h3>
              <div className="flex flex-wrap gap-3 mt-3">
                {selectedFoodItem.category.map((cat, index) => (
                  <span
                    key={cat._id}
                    className={`px-4 py-2 rounded-full text-white text-sm font-medium shadow-md ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-blue-500 to-blue-700"
                        : "bg-gradient-to-r from-purple-500 to-purple-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Times */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Available Times
              </h3>
              <div className="flex flex-wrap gap-3 mt-3">
                {selectedFoodItem.time.map((t, index) => (
                  <span
                    key={t._id}
                    className={`px-4 py-2 rounded-full text-white text-sm font-medium shadow-md ${
                      index % 2 === 0
                        ? "bg-gradient-to-r from-green-500 to-green-700"
                        : "bg-gradient-to-r from-teal-500 to-teal-700"
                    }`}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FoodItemsSection;
