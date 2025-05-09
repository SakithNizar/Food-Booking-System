import mongoose from 'mongoose';

const transportationBookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  passengers: {
    type: Number,
    required: true,
    min: 1
  },
  pickup: {
    type: String,
    required: true,
    trim: true
  },
  dropoff: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['standard', 'premium', 'luxury'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

// Calculate price based on service type
transportationBookingSchema.pre('save', function(next) {
  const baseRates = {
    standard: 50,
    premium: 100,
  };
  
  // Additional fee for more passengers
  const passengerFee = Math.max(0, this.passengers - 2) * 20;
  
  this.price = baseRates[this.serviceType] + passengerFee;
  
  next();
});

const TransportationBooking = mongoose.model('TransportationBooking', transportationBookingSchema);

export default TransportationBooking;