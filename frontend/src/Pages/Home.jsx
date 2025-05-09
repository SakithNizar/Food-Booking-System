import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-emerald-100 via-white to-lime-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Welcome to Twin Green Food Service
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We deliver delightful catering experiences for all your special events.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => navigate("/admin")}
              className="bg-green-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              Enter Admin Panel ⏩
            </button>
            <button
              onClick={() => navigate("/about")}
              className="border border-green-600 text-green-700 py-2 px-6 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              About Us ℹ️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
