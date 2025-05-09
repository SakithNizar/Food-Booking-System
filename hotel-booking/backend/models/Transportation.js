import mongoose from 'mongoose';

const transportationSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true
  },
  driverName: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Vehicle capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  revenue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the "updatedAt" field on save
transportationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Transportation = mongoose.model('Transportation', transportationSchema);

export default Transportation;