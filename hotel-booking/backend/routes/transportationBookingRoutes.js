import express from 'express';
import {
  getAllBookings,
  getBookingsByStatus,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingStats,
  generateBookingReport,
} from '../controllers/transportationBookingController.js';

const router = express.Router();

// Admin routes
router.get('/admin/bookings', getAllBookings);
router.get('/admin/bookings/status/:status', getBookingsByStatus);
router.get('/admin/bookings/stats', getBookingStats);
router.get('/admin/bookings/:id', getBookingById);
router.put('/admin/bookings/:id', updateBooking);
router.delete('/admin/bookings/:id', deleteBooking);

// Guest routes
router.post('/bookings', createBooking);
router.get('/bookings/:id', getBookingById);

// Reports
router.get('/report/pdf', generateBookingReport);

export default router;
