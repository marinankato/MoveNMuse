import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

//   console.log("Booking ID from URL:", bookingId);

  useEffect(() => {
    const fetchBookingAndCart = async () => {
      try {
        // Get the booking by ID
        const bookingRes = await fetch(`http://localhost:5001/api/bookings/${bookingId}`);
        if (!bookingRes.ok) throw new Error("Booking not found");
        const bookingData = await bookingRes.json();
        setBooking(bookingData);

        // Then fetch the cart linked to this booking
        const cartRes = await fetch(`http://localhost:5001/api/cart/${bookingData.cart?._id}`);
        if (!cartRes.ok) throw new Error("Cart not found");
        const cartData = await cartRes.json();
        setCart(cartData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndCart();
  }, [bookingId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Booking Info</h2>
        <p><strong>Booking ID:</strong> {booking._id}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Order Date:</strong> {new Date(booking.orderDate).toLocaleString()}</p>
        <p><strong>Order Total:</strong> ${booking.orderTotal}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Booked Items</h2>
        {cart?.items?.length > 0 ? (
          cart.items.map((item, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Quantity:</strong> {item.quantity || 1}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Total:</strong> ${item.price * (item.quantity || 1)}</p>
            </div>
          ))
        ) : (
          <p>No items found in cart.</p>
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
