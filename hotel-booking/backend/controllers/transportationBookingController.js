import TransportationBooking from '../models/TransportationBooking.js';
import PDFDocument from 'pdfkit';
import Transportation from '../models/Transportation.js'; // Only needed if used for additional population or logic

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await TransportationBooking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get bookings by status
export const getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const bookings = await TransportationBooking.find({ status }).sort({ arrivalDate: 1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await TransportationBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      roomNumber,
      arrivalTime,
      arrivalDate,
      passengers,
      pickup,
      dropoff,
      serviceType = 'standard'
    } = req.body;

    if (!guestName || !roomNumber || !arrivalTime || !arrivalDate || !passengers || !pickup || !dropoff) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newBooking = new TransportationBooking({
      guestName,
      roomNumber,
      arrivalTime,
      arrivalDate,
      passengers,
      pickup,
      dropoff,
      serviceType
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const {
      guestName,
      roomNumber,
      arrivalTime,
      arrivalDate,
      passengers,
      pickup,
      dropoff,
      serviceType,
      status
    } = req.body;

    const updatedBooking = await TransportationBooking.findByIdAndUpdate(
      req.params.id,
      {
        guestName,
        roomNumber,
        arrivalTime,
        arrivalDate,
        passengers,
        pickup,
        dropoff,
        serviceType,
        status
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await TransportationBooking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await TransportationBooking.countDocuments();
    const pendingBookings = await TransportationBooking.countDocuments({ status: 'pending' });
    const confirmedBookings = await TransportationBooking.countDocuments({ status: 'confirmed' });
    const completedBookings = await TransportationBooking.countDocuments({ status: 'completed' });
    const cancelledBookings = await TransportationBooking.countDocuments({ status: 'cancelled' });

    const serviceTypeStats = await TransportationBooking.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$price' }
        }
      }
    ]);

    res.status(200).json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      serviceTypeStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Generate Booking Report PDF
export const generateBookingReport = async (req, res) => {
  try {
    const bookings = await TransportationBooking.find().populate("transportationId");

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=booking_report.pdf");

    doc.pipe(res);

    doc.fontSize(22).text("Transportation Booking Summary Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveDown().moveDown();

    doc.fontSize(14).text(`Total Bookings: ${bookings.length}`);
    doc.moveDown();

    bookings.forEach((booking, index) => {
      doc
        .fontSize(12)
        .text(`Booking #${index + 1}`, { underline: true })
        .text(`Guest Name       : ${booking.guestName}`)
        .text(`Contact Number   : ${booking.contactNumber || 'N/A'}`)
        .text(`Vehicle Type     : ${booking.transportationId?.vehicleType || "N/A"}`)
        .text(`Pickup Location  : ${booking.pickup || "N/A"}`)
        .text(`Drop-off Location: ${booking.dropoff || "N/A"}`)
        .text(`Booking Date     : ${new Date(booking.arrivalDate).toLocaleDateString()}`)
        .text(`Fare / Payment   : ${booking.fare ? `$${booking.fare}` : "N/A"}`)
        .moveDown();
    });

    const vehicleCounts = {};
    bookings.forEach(b => {
      const type = b.transportationId?.vehicleType || "Unknown";
      vehicleCounts[type] = (vehicleCounts[type] || 0) + 1;
    });

    doc.addPage().fontSize(16).text("Booking Statistics Summary", { align: "center" }).moveDown();

    Object.entries(vehicleCounts).forEach(([type, count]) => {
      doc.fontSize(12).text(`${type}: ${count} bookings`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate detailed PDF");
  }
};
