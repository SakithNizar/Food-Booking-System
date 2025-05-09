"use client"

import { Routes, Route, Link, useLocation } from "react-router-dom"
import TransportationList from "./TransportationList"
import TransportationForm from "./TransportationForm"
import BookingStats from "./BookingStats"
import { BarChartIcon as ChartBar, Truck, PlusCircle } from "lucide-react"

function AdminDashboard() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path))
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-stone-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                to="/admin"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-green-600 text-white"
                    : "text-stone-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <Truck className="w-5 h-5 mr-3" />
                <span>Transportation Options</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/admin/add")
                    ? "bg-green-600 text-white"
                    : "text-stone-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                <span>Add New Option</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/stats"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive("/admin/stats")
                    ? "bg-green-600 text-white"
                    : "text-stone-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                <ChartBar className="w-5 h-5 mr-3" />
                <span>Booking Statistics</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <Routes>
            <Route index element ={<TransportationList />} />
            <Route path="add" element={<TransportationForm />} />
            <Route path="edit/:id" element={<TransportationForm />} />
            <Route path="stats" element={<BookingStats />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
