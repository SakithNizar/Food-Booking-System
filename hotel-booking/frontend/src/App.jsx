"use client"

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import GuestTransportation from "./components/GuestTransportation";
import TransportationList from './components/TransportationList';
import TransportationForm from "./components/TransportationForm";
import BookingStats from "./components/BookingStats";
import "./app.css";

// Active link tracker
const NavLink = ({ to, children }) => {
  const location = useLocation()
  const isActive = location.pathname.startsWith(to)

  return (
    <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  )
}

// Header component with animation
const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`app-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <img src="/public/logo.jpg" alt="Twin Green Salankanda" />
          <div className="logo-text">
            <div className="logo-main">
              <span className="logo-twin">TWIN</span>
              <span className="logo-green">GREEN</span>
            </div>
            <span className="logo-salankanda">Salankanda</span>
          </div>
        </div>
        <div className="view-toggle">
          <NavLink to="/admin">Admin Dashboard</NavLink>
          <NavLink to="/guest">Guest Transportation</NavLink>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/guest/*" element={<GuestTransportation />} />
          <Route index element={<TransportationList />} />
          <Route path="add" element={<TransportationForm />} />
          <Route path="edit/:id" element={<TransportationForm />} />
          <Route path="booking-stat" element={<BookingStats />} />
          <Route path="/" element={<Home />} />

          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Twin Green Salankanda. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

const Home = () => (
  <div className="home-container">
    <div className="home-content">
      <h1>Welcome to Twin Green Transportation</h1>
      <p>Experience comfort and luxury with our premium transportation options</p>
      <div className="mountain-decoration">
        <div className="mountain mountain-1"></div>
        <div className="mountain mountain-2"></div>
      </div>
      <div className="home-buttons">
        <Link to="/guest" className="home-button guest">
          Book Transportation
        </Link>
        <Link to="/admin" className="home-button admin">
          Admin Dashboard
        </Link>
      </div>
    </div>
  </div>
)

export default App
