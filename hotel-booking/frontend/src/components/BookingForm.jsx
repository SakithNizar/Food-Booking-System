"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, Calendar, Users, MapPin, User, Home, AlertCircle } from "lucide-react"

function BookingForm() {
  const { id } = useParams() // transportation option id
  const [transportation, setTransportation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    arrivalTime: "",
    arrivalDate: "",
    passengers: 1,
    pickup: "",
    dropoff: "",
    serviceType: "standard",
  })
  const [errors, setErrors] = useState({
    guestName: "",
    roomNumber: "",
    arrivalTime: "",
    arrivalDate: "",
    passengers: "",
    pickup: "",
    dropoff: "",
  })
  const [touched, setTouched] = useState({
    guestName: false,
    roomNumber: false,
    arrivalTime: false,
    arrivalDate: false,
    passengers: false,
    pickup: false,
    dropoff: false,
  })
  const navigate = useNavigate()

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/api/transportation/${id}`)
      .then((res) => {
        setTransportation(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching transportation option", err)
        setLoading(false)
      })
  }, [id])

  // Validate form fields
  const validateField = (name, value) => {
    switch (name) {
      case "guestName":
        return value.trim() === ""
          ? "Guest name is required"
          : !/^[a-zA-Z\s]+$/.test(value)
            ? "Name should contain only letters and spaces"
            : value.trim().length < 3
              ? "Name should be at least 3 characters long"
              : ""

      case "roomNumber":
        return value.trim() === ""
          ? "Room number is required"
          : !/^[A-Za-z0-9-]+$/.test(value)
            ? "Room number should contain only letters, numbers, and hyphens"
            : ""

      case "arrivalTime":
        return value === "" ? "Arrival time is required" : ""

      case "arrivalDate":
        if (value === "") return "Arrival date is required"

        const selectedDate = new Date(value)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        return selectedDate < currentDate ? "Cannot select a past date" : ""

      case "passengers":
        if (value === "") return "Number of passengers is required"

        const passengerCount = Number.parseInt(value)
        if (isNaN(passengerCount)) return "Please enter a valid number"
        if (passengerCount < 1) return "At least 1 passenger is required"

        // Check against vehicle capacity if transportation data is available
        if (transportation && passengerCount > transportation.capacity) {
          return `Maximum capacity for this vehicle is ${transportation.capacity} passengers`
        }

        return ""

      case "pickup":
        return value.trim() === ""
          ? "Pickup location is required"
          : value.trim().length < 3
            ? "Pickup location should be more specific"
            : ""

      case "dropoff":
        return value.trim() === ""
          ? "Dropoff location is required"
          : value.trim().length < 3
            ? "Dropoff location should be more specific"
            : ""

      default:
        return ""
    }
  }

  // Validate all form fields
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      if (key !== "serviceType") {
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
      await axios.post("/api/transportationBooking/bookings", {
        ...formData,
        transportationId: id,
      })

      // Show success notification
      const notification = document.getElementById("notification")
      notification.classList.remove("hidden")
      setTimeout(() => {
        navigate("/guest")
      }, 2000)
    } catch (error) {
      console.error("Error creating booking", error)
      setSubmitting(false)

      // Show error notification
      const errorNotification = document.getElementById("error-notification")
      errorNotification.classList.remove("hidden")
      setTimeout(() => {
        errorNotification.classList.add("hidden")
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center p-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md mb-8"></div>
          <div className="w-full max-w-md space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              </div>
            ))}
            <div className="h-12 w-full bg-gray-200 rounded-md mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  const hasErrors = Object.values(errors).some((error) => error)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-green-600 font-semibold mb-1">
              Transportation Booking
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {transportation.vehicleType}
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Capacity: {transportation.capacity} passengers)
              </span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border ${
                      touched.guestName && errors.guestName ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                  />
                  {touched.guestName && errors.guestName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.guestName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Home className="h-4 w-4 mr-2 text-green-600" />
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border ${
                      touched.roomNumber && errors.roomNumber ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                  />
                  {touched.roomNumber && errors.roomNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.roomNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border ${
                      touched.arrivalTime && errors.arrivalTime
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                  />
                  {touched.arrivalTime && errors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.arrivalTime}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={today} // Disables past dates
                    required
                    className={`w-full px-3 py-2 border ${
                      touched.arrivalDate && errors.arrivalDate
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                  />
                  {touched.arrivalDate && errors.arrivalDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.arrivalDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 mr-2 text-green-600" />
                  Number of Passengers
                </label>
                <input
                  type="number"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  max={transportation.capacity}
                  required
                  className={`w-full px-3 py-2 border ${
                    touched.passengers && errors.passengers ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                />
                {touched.passengers && errors.passengers && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.passengers}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="e.g., Airport, Hotel, Address"
                  className={`w-full px-3 py-2 border ${
                    touched.pickup && errors.pickup ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                />
                {touched.pickup && errors.pickup && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.pickup}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  Dropoff Location
                </label>
                <input
                  type="text"
                  name="dropoff"
                  value={formData.dropoff}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="e.g., Resort, Hotel, Address"
                  className={`w-full px-3 py-2 border ${
                    touched.dropoff && errors.dropoff ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600`}
                />
                {touched.dropoff && errors.dropoff && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.dropoff}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`border rounded-md p-3 flex items-center cursor-pointer ${
                      formData.serviceType === "standard"
                        ? "border-green-600 bg-green-50 text-brown-700"
                        : "border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, serviceType: "standard" }))}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value="standard"
                      checked={formData.serviceType === "standard"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Standard</span>
                  </div>

                  <div
                    className={`border rounded-md p-3 flex items-center cursor-pointer ${
                      formData.serviceType === "premium"
                        ? "border-green-600 bg-green-50 text-brown-700"
                        : "border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, serviceType: "premium" }))}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value="premium"
                      checked={formData.serviceType === "premium"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Premium</span>
                  </div>
                </div>
              </div>

              {/* Form-level error message */}
              {hasErrors && (
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

              <button
                type="submit"
                disabled={hasErrors || submitting}
                className={`w-full py-3 px-4 bg-brown-700 hover:bg-brown-800 text-black font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors duration-200 ${
                  hasErrors || submitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>

            {/* Success notification */}
            <div
              id="notification"
              className="hidden fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg"
            >
              Booking successful! Redirecting...
            </div>

            {/* Error notification */}
            <div
              id="error-notification"
              className="hidden fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-md shadow-lg"
            >
              Error creating booking. Please try again.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm;
