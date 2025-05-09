"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function TransportationList() {
  const [transportations, setTransportations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchTransportations = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("/api/transportation")
      setTransportations(res.data)
    } catch (error) {
      console.error("Error fetching transportation options", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransportations()
  }, [])

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/api/transportation/${id}/toggle-status`)
      fetchTransportations()
    } catch (error) {
      console.error("Error toggling status", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transportation option?")) {
      try {
        await axios.delete(`/api/transportation/${id}`)
        fetchTransportations()
      } catch (error) {
        console.error("Error deleting transportation option", error)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-800">Transportation Options</h2>
        <button
          onClick={() => navigate("/admin/add")}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : transportations.length === 0 ? (
        <div className="bg-stone-50 rounded-lg p-8 text-center">
          <p className="text-stone-600">No transportation options found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Vehicle Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Driver Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Capacity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {transportations.map((option) => (
                <tr key={option._id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {option.vehicleType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{option.driverName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{option.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    Rs.{option.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${option.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {option.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/edit/${option._id}`)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(option._id)}
                      className="text-stone-600 hover:text-stone-900 mr-3"
                    >
                      {option.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(option._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  )
}

export default TransportationList;
