import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-100 relative px-4 py-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Back Button in top-left corner */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600 transition"
      >
        ← Back to Home
      </button>

      {/* Twin Green Title */}
      <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center">
        Twin Green
      </h2>

      {/* Main Content */}
      <div className="max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          At{" "}
          <span className="font-semibold text-green-600">
            Twin Green Food Service
          </span>
          , we are dedicated to providing exceptional catering experiences for
          all types of events—whether it's a small gathering or a large
          celebration. Our passion for delicious, fresh food and outstanding
          service is at the heart of everything we do.
        </p>
      </div>
    </div>
  );
};

export default About;
