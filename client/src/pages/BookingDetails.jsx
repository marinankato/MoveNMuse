import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingWithSessions = async () => {
      try {
        const bookingData = await api.getBookingDetails(bookingId);

        // Fetch session details for each booked item
        const itemsWithSessions = await Promise.all(
          bookingData.items.map(async (item) => {
            if (!item.occurrenceId) return item;

            // Fetch session details by occurrenceId (sessionId)
            try {
              const session = await api.getCourseSession(item.occurrenceId);
              return { ...item, session };
            } catch (err) {
              console.warn("Failed to fetch session:", err);
              return { ...item, session: null };
            }
          })
        );

        setBooking({ ...bookingData, items: itemsWithSessions });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingWithSessions();
  }, [bookingId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

      {/* Booking Info */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Booking Info</h2>
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Order Date:</strong> {new Date(booking.orderDate).toLocaleString()}</p>
        <p><strong>Order Total:</strong> ${booking.orderTotal}</p>
      </div>

      {/* Booked Items */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Booked Items</h2>
        {booking.items && booking.items.length > 0 ? (
          booking.items.map((item, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <p><strong>Item ID:</strong> {item.itemId}</p>
              <p><strong>Type:</strong> {item.productType}</p>

              {item.session ? (
                <>
                  <p><strong>Course Name:</strong> {item.session.courseName}</p>
                  <p><strong>Start Time:</strong> {new Date(item.session.startTime).toLocaleString()}</p>
                  <p><strong>End Time:</strong> {new Date(item.session.endTime).toLocaleString()}</p>
                  <p><strong>Instructor ID:</strong> {item.session.instructorId}</p>
                  <p><strong>Location:</strong> {item.session.location}</p>
                  {/* <p><strong>Price:</strong> ${item.session.price}</p> */}
                </>
              ) : (
                <p className="text-red-600">Session details not available</p>
              )}
            </div>
          ))
        ) : (
          <p>No items found in booking.</p>
        )}
      </div>

      <div className="mt-6">
        <Link to="/account" className="text-blue-600 hover:underline">
          ← Back to My Account
        </Link>
      </div>
    </div>
  );
};

export default BookingDetails;
