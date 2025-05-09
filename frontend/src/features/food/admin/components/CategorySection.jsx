import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../config/axiosConfig";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import Modal from "../../../../components/Modal";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const openModal = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      setIsEditing(true);
      setFormData(category);
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        description: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleViewModal = (category = null) => {
    setSelectedCategory(category);
    setViewCategory(!viewCategory);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(
          `/food-categories/${selectedCategory._id}`,
          formData
        );
        setCategories(
          categories.map((item) =>
            item._id === selectedCategory._id ? formData : item
          )
        );
      } else {
        const response = await axiosInstance.post("/food-categories", formData);
        setCategories([...categories, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/food-categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      toggleViewModal();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const removeFood = async (id) => {
    try {
      await axiosInstance.put(
        `/food-categories/${selectedCategory._id}/remove-food/${id}`
      );
      setCategories(
        categories.map((category) =>
          category._id === selectedCategory._id
            ? {
                ...category,
                food: category.food.filter((food) => food._id !== id),
              }
            : category
        )
      );
    } catch (error) {
      console.error("Error removing food from category:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/food-categories");
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg min-h-[50vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Manage Food Categories</h2>
        <button
          onClick={() => openModal()}
          className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full shadow-md cursor-pointer"
        >
          <FaPlus />
        </button>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category._id}
            className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all shadow-sm"
            onClick={() => toggleViewModal(category)}
          >
            {category.name}
          </li>
        ))}
      </ul>

      {/* Modal for adding new food category or editinga food category */}
      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit Meal Category" : "Add Meal Category"}
        onClose={closeModal}
      >
        <div className="p-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter meal category"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            {isEditing ? (
              <>
                <FaSave className="inline" /> Save Changes
              </>
            ) : (
              "Add Meal Category"
            )}
          </button>
        </div>
      </Modal>

      {/* Modal for viewing meal category details */}
      {selectedCategory && viewCategory && (
        <Modal
          isOpen={viewCategory}
          title="Twin Green"
          onClose={toggleViewModal}
        >
          <div className="p-6 bg-white rounded-xl shadow-lg relative">
            <h2 className="text-lg font-semibold">{selectedCategory.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedCategory.description}
            </p>
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-3">
              <button
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                onClick={() => openModal(selectedCategory)}
              >
                <FaEdit size={18} />
              </button>
              <button
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                onClick={() => handleDelete(selectedCategory._id)}
              >
                <FaTrash size={18} />
              </button>
            </div>
            <ul className="space-y-2">
              {selectedCategory.food.length !== 0 ? (
                selectedCategory.food.map((food) => (
                  <li
                    key={food._id}
                    className="p-3 flex items-center justify-between bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all shadow-sm"
                  >
                    <div>{food.name}</div>
                    <div
                      onClick={() => removeFood(food._id)}
                      className="text-white bg-red-600 p-2 rounded-2xl"
                    >
                      Remove
                    </div>
                  </li>
                ))
              ) : (
                <p>No food items in this category</p>
              )}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategorySection;
