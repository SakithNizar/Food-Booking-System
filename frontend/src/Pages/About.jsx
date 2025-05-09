import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-100 flex items-center justify-center px-4">
      <div className="max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          At <span className="font-semibold text-green-600">Twin Green Food Service</span>, we are dedicated to providing exceptional catering experiences for all types of events—whether it's a small gathering or a large celebration. Our passion for delicious, fresh food and outstanding service is at the heart of everything we do.
        </p>
      </div>
    </div>
  );
};

export default About;
