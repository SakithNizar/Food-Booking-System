"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { Car, User, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react"

function TransportationForm() {
  const { id } = useParams()
  const [loading, setLoading] = useState(!!id)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    vehicleType: "",
    driverName: "",
    capacity: "",
    revenue: 0,
    contactNumber: "",
    status: "Active",
  })
  const [errors, setErrors] = useState({
    vehicleType: "",
    driverName: "",
    capacity: "",
    revenue: "",
    contactNumber: "",
  })
  const [touched, setTouched] = useState({
    vehicleType: false,
    driverName: false,
    capacity: false,
    revenue: false,
    contactNumber: false,
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      setLoading(true)
      // Fetch transportation data for editing
      axios
        .get(`/api/transportation/${id}`)
        .then((res) => {
          setFormData(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching transportation option", err)
          setLoading(false)
        })
    }
  }, [id])

  // Validate form data
  const validateField = (name, value) => {
    switch (name) {
      case "vehicleType":
        return value.trim() === ""
          ? "Vehicle type is required"
          : value.length < 3
            ? "Vehicle type must be at least 3 characters"
            : ""
      case "driverName":
        return value.trim() === ""
          ? "Driver name is required"
          : !/^[a-zA-Z\s]+$/.test(value)
            ? "Driver name should contain only letters and spaces"
            : ""
      case "capacity":
        return value === ""
          ? "Capacity is required"
          : Number.parseInt(value) < 1
            ? "Capacity must be at least 1 passenger"
            : Number.parseInt(value) > 50
              ? "Capacity seems too high"
              : ""
      case "revenue":
        return value === "" ? "Revenue is required" : Number.parseFloat(value) < 0 ? "Revenue cannot be negative" : ""
      case "contactNumber":
        return value.trim() === ""
          ? "Contact number is required"
          : !/^[0-9+\-\s]+$/.test(value)
            ? "Please enter a valid contact number"
            : ""
      default:
        return ""
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      if (key !== "status") {
        const error = validateField(key, formData[key].toString())
        newErrors[key] = error
        if (error) {
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Live validation
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))

    // Mark field as touched
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate on blur
    const error = validateField(name, formData[name].toString())
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    // Validate all fields before submission
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      if (id) {
        // Update existing transportation option
        await axios.put(`/api/transportation/${id}`, formData)
      } else {
        // Create new transportation option
        await axios.post("/api/transportation", formData)
      }
      navigate("/admin")
    } catch (error) {
      console.error("Error submitting transportation option", error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex justify-center items-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-stone-200 rounded mb-6"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="mb-6">
                <div className="h-4 bg-stone-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-stone-200 rounded w-full"></div>
              </div>
            ))}
            <div className="h-10 bg-stone-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Car className="mx-auto h-12 w-12 text-green-700" />
          <h2 className="mt-2 text-3xl font-extrabold text-stone-800">{id ? "Edit" : "Add"} Transportation Option</h2>
          <p className="mt-2 text-sm text-stone-600">
            {id
              ? "Update the details of your transportation service"
              : "Create a new transportation service for guests"}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="vehicleType" className="flex items-center text-sm font-medium text-stone-700 mb-1">
                <Car className="h-4 w-4 mr-2 text-green-600" />
                Vehicle Type
              </label>
              <input
                type="text"
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-3 py-2 border ${
                  touched.vehicleType && errors.vehicleType ? "border-red-500 ring-1 ring-red-500" : "border-stone-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="e.g., Luxury Sedan, SUV, Minivan"
              />
              {touched.vehicleType && errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.vehicleType}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="driverName" className="flex items-center text-sm font-medium text-stone-700 mb-1">
                <User className="h-4 w-4 mr-2 text-green-600" />
                Driver Name
              </label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-3 py-2 border ${
                  touched.driverName && errors.driverName ? "border-red-500 ring-1 ring-red-500" : "border-stone-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="Full name of the driver"
              />
              {touched.driverName && errors.driverName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.driverName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className="flex items-center text-sm font-medium text-stone-700 mb-1">
                <User className="h-4 w-4 mr-2 text-green-600" />
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`w-full px-3 py-2 border ${
                  touched.contactNumber && errors.contactNumber
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-stone-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="Contact number"
              />
              {touched.contactNumber && errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.contactNumber}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="capacity" className="flex items-center text-sm font-medium text-stone-700 mb-1">
                <Users className="h-4 w-4 mr-2 text-green-600" />
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min="1"
                className={`w-full px-3 py-2 border ${
                  touched.capacity && errors.capacity ? "border-red-500 ring-1 ring-red-500" : "border-stone-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="Number of passengers"
              />
              {touched.capacity && errors.capacity && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.capacity}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="revenue" className="flex items-center text-sm font-medium text-stone-700 mb-1">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Revenue
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-stone-500 sm:text-sm">Rs.</span>
                </div>
                <input
                  type="number"
                  id="revenue"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  className={`w-full pl-7 pr-3 py-2 border ${
                    touched.revenue && errors.revenue ? "border-red-500 ring-1 ring-red-500" : "border-stone-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  placeholder="0.00"
                />
              </div>
              {touched.revenue && errors.revenue && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.revenue}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-stone-700 mb-1">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    formData.status === "Active" ? "border-green-500 bg-green-50 text-green-700" : "border-stone-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, status: "Active" }))}
                >
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <CheckCircle
                    className={`h-5 w-5 mr-2 ${formData.status === "Active" ? "text-green-500" : "text-stone-400"}`}
                  />
                  <span>Active</span>
                </div>

                <div
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    formData.status === "Inactive" ? "border-green-500 bg-green-50 text-green-700" : "border-stone-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, status: "Inactive" }))}
                >
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <XCircle
                    className={`h-5 w-5 mr-2 ${formData.status === "Inactive" ? "text-green-500" : "text-stone-400"}`}
                  />
                  <span>Inactive</span>
                </div>
              </div>
            </div>

            {/* Form-level error message */}
            {Object.values(errors).some((error) => error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the validation errors before submitting
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="inline-flex items-center px-4 py-2 border border-stone-300 shadow-sm text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || Object.values(errors).some((error) => error)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  submitting || Object.values(errors).some((error) => error) ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : id ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransportationForm;
