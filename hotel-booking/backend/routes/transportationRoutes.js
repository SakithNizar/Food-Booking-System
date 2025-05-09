import express from 'express';
import {
  getAllTransportation,
  getTransportationById,
  createTransportation,
  updateTransportation,
  toggleTransportationStatus,
  deleteTransportation
} from '../controllers/transportationController.js';

const router = express.Router();

// Get all transportation options
router.get('/', getAllTransportation);

// Get a single transportation option
router.get('/:id', getTransportationById);

// Create a new transportation option
router.post('/', createTransportation);

// Update a transportation option
router.put('/:id', updateTransportation);

// Toggle transportation status
router.patch('/:id/toggle-status', toggleTransportationStatus);

// Delete a transportation option
router.delete('/:id', deleteTransportation);

export default router;