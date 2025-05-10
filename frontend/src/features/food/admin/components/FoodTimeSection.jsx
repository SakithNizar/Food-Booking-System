import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../config/axiosConfig";
import { FaPlus } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import Modal from "../../../../components/Modal";

const FoodTimeSection = () => {
  const [buffetTimes, setBuffetTimes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewTime, setViewTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    price: "",
  });

  const openModal = (time = null) => {
    setSelectedTime(time);
    if (time) {
      setIsEditing(true);
      setFormData(time);
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        price: "",
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTime(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleViewModal = (time = null) => {
    setSelectedTime(time);
    setViewTime(!viewTime);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axiosInstance.put(`/food-times/${selectedTime._id}`, formData);
        setBuffetTimes(
          buffetTimes.map((item) =>
            item._id === selectedTime._id ? formData : item
          )
        );
      } else {
        const response = await axiosInstance.post("/food-times", formData);
        setBuffetTimes([...buffetTimes, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving meal time:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/food-times/${id}`);
      setBuffetTimes(buffetTimes.filter((item) => item._id !== id));
      toggleViewModal();
    } catch (error) {
      console.error("Error deleting meal time:", error);
    }
  };

  useEffect(() => {
    const fetchBuffetTimes = async () => {
      try {
        const response = await axiosInstance.get("/food-times");
        setBuffetTimes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching buffet times:", error);
      }
    };

    fetchBuffetTimes();
  }, []);

  const formatTime = (time) => {
    if (!time) return "N/A";

    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Meal Buffet</h2>
        <button
          onClick={() => openModal()}
          className="text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-full shadow-md cursor-pointer"
        >
          <FaPlus />
        </button>
      </div>
      <ul className="space-y-2">
        {buffetTimes.map((time) => (
          <li
            key={time._id}
            className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-all shadow-sm"
            onClick={() => toggleViewModal(time)}
          >
            {time.name}
          </li>
        ))}
      </ul>

      {/* Modal for adding new buffet time */}
      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit Meal Time" : "Add Buffet Detals"}
        onClose={closeModal}
      >
        <div className="p-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter buffet name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
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
              "Add Buffet Details"
            )}
          </button>
        </div>
      </Modal>

      {/* Modal for viewing meal time details */}
      {selectedTime && (
        <Modal isOpen={viewTime} title="Twin Green" onClose={toggleViewModal}>
          <div className="p-6 bg-white rounded-xl shadow-lg relative">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-3">
              <button
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                onClick={() => openModal(selectedTime)}
              >
                <FaEdit size={18} />
              </button>
              <button
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                onClick={() => handleDelete(selectedTime._id)}
              >
                <FaTrash size={18} />
              </button>
            </div>

            {/* Modal Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Meal Time Details
              </h2>
              <p className="text-gray-500">Here’s the detailed information</p>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="text-gray-800">{selectedTime.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Description:</span>
                <span className="text-gray-800">
                  {selectedTime.description}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Start Time:</span>
                <span className="text-gray-800">
                  {formatTime(selectedTime.startTime)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">End Time:</span>
                <span className="text-gray-800">
                  {formatTime(selectedTime.endTime)}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Price:</span>
                <span className="text-green-600 font-semibold">
                  Rs. {selectedTime.price}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FoodTimeSection;
