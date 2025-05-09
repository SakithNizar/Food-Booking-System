import Transportation from '../models/Transportation.js';

// Get all transportation options
export const getAllTransportation = async (req, res) => {
  try {
    const transportations = await Transportation.find();
    res.status(200).json(transportations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a single transportation option by ID
export const getTransportationById = async (req, res) => {
  try {
    const transportation = await Transportation.findById(req.params.id);
    if (!transportation) {
      return res.status(404).json({ message: 'Transportation option not found' });
    }
    res.status(200).json(transportation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new transportation option
export const createTransportation = async (req, res) => {
  try {
    const { vehicleType, driverName, capacity, revenue, status } = req.body;
    
    if (!vehicleType || !driverName || !capacity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newTransportation = new Transportation({
      vehicleType,
      driverName,
      capacity,
      revenue: revenue || 0,
      status: status || 'Active'
    });
    
    await newTransportation.save();
    res.status(201).json(newTransportation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a transportation option
export const updateTransportation = async (req, res) => {
  try {
    const { vehicleType, driverName, capacity, revenue, status } = req.body;
    
    const updatedTransportation = await Transportation.findByIdAndUpdate(
      req.params.id,
      {
        vehicleType,
        driverName,
        capacity,
        revenue,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedTransportation) {
      return res.status(404).json({ message: 'Transportation option not found' });
    }
    
    res.status(200).json(updatedTransportation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Toggle transportation status (Active/Inactive)
export const toggleTransportationStatus = async (req, res) => {
  try {
    const transportation = await Transportation.findById(req.params.id);
    
    if (!transportation) {
      return res.status(404).json({ message: 'Transportation option not found' });
    }
    
    transportation.status = transportation.status === 'Active' ? 'Inactive' : 'Active';
    transportation.updatedAt = Date.now();
    
    await transportation.save();
    
    res.status(200).json(transportation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a transportation option
export const deleteTransportation = async (req, res) => {
  try {
    const deletedTransportation = await Transportation.findByIdAndDelete(req.params.id);
    
    if (!deletedTransportation) {
      return res.status(404).json({ message: 'Transportation option not found' });
    }
    
    res.status(200).json({ message: 'Transportation option deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};