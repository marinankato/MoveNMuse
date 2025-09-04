import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [seats, setSeats] = useState(1);
  const navigate = useNavigate();

  const confirmBooking = () => {
    alert(`Booking confirmed! Seats: ${seats}`);
    navigate("/mybookings");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <p>Session: Hip Hop Basics - 2025-09-10 18:00</p>
      <label className="block mt-2">
        Seats:
        <input
          type="number"
          value={seats}
          min="1"
          onChange={(e) => setSeats(e.target.value)}
          className="ml-2 border rounded px-2"
        />
      </label>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={confirmBooking}
      >
        Confirm Booking
      </button>
    </div>
  );
}

export default Checkout;
