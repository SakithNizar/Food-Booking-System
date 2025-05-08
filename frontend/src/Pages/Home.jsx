import React from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Use the navigate function from useNavigate


  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-2xl p-10">
        Welcome to the Twin Green Food Service
      </h1>
      <p>We provide the best catering services for all your events.</p>
      <button onClick={()=> navigate("/admin")}>⏩</button>
    </div>
  );
};

export default Home;
