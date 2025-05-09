"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2, AlertCircle } from "lucide-react"


function BookingStats() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingsError, setBookingsError] = useState(null)
  const [updatingBooking, setUpdatingBooking] = useState(null)

  useEffect(() => {
    // Fetch booking statistics
    setLoading(true)
    axios
      .get("/api/transportationBooking/admin/bookings/stats")
      .then((res) => {
        setStats(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching booking stats", err)
        setError("Failed to load statistics. Please try again later.")
        setLoading(false)
      })

    // Fetch all bookings
    setBookingsLoading(true)
    axios
      .get("/api/transportationBooking/admin/bookings")
      .then((res) => {
        setBookings(res.data)
        setBookingsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching bookings", err)
        setBookingsError("Failed to load bookings. Please try again later.")
        setBookingsLoading(false)
      })
  }, [])

  // Prepare chart data from service type stats
  const prepareChartData = () => {
    if (!stats?.serviceTypeStats) return []
    return stats.serviceTypeStats.map((stat) => ({
      name: stat._id,
      bookings: stat.count,
      revenue: stat.totalRevenue,
    }))
  }

  // Update the booking's status in the state immediately
  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking._id === bookingId) {
        return { ...booking, status: newStatus }
      }
      return booking
    })
    setBookings(updatedBookings)
  }

  // Send update request to change the booking status in the backend
  const updateBookingStatus = (bookingId) => {
    setUpdatingBooking(bookingId)
    // Find the booking from the current state
    const booking = bookings.find((b) => b._id === bookingId)
    axios
      .put(`/api/transportationBooking/admin/bookings/${bookingId}`, { ...booking })
      .then((res) => {
        // Update the state with the updated booking info
        const updatedBookings = bookings.map((b) => (b._id === bookingId ? res.data : b))
        setBookings(updatedBookings)
        setUpdatingBooking(null)
      })
      .catch((err) => {
        console.error("Error updating booking", err)
        setUpdatingBooking(null)
      })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="mt-4 text-stone-600">Loading statistics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200 p-6">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header and Stats Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-800">Booking Statistics</h2>
        <div className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
          Total: {stats.totalBookings} Bookings
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
          <p className="text-sm font-medium text-stone-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-stone-800">{stats.pendingBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-400">
          <p className="text-sm font-medium text-stone-500 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-stone-800">{stats.confirmedBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
          <p className="text-sm font-medium text-stone-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-stone-800">{stats.completedBookings}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-400">
          <p className="text-sm font-medium text-stone-500 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-stone-800">{stats.cancelledBookings}</p>
        </div>
      </div>

      {/* Service Type Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-stone-800 mb-6">Service Type Statistics</h3>

        {/* Chart */}
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3c9a41" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {stats.serviceTypeStats.map((stat) => (
                <tr key={stat._id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{stat._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{stat.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    Rs.{stat.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Table with Editable Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-stone-800 mb-6">All Bookings</h3>
        {bookingsLoading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            <p className="mt-4 text-stone-600">Loading bookings...</p>
          </div>
        ) : bookingsError ? (
          <div className="flex items-center justify-center h-32 bg-red-50 rounded-lg border border-red-200 p-6">
            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            <p className="text-red-600">{bookingsError}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Arrival Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-stone-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                      {booking.guestName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{booking.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {new Date(booking.arrivalDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{booking.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="border border-stone-300 rounded p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      <button
                        onClick={() => updateBookingStatus(booking._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        disabled={updatingBooking === booking._id}
                      >
                        {updatingBooking === booking._id ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingStats
