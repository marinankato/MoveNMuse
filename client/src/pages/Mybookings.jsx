import React from "react";

const bookings = [
  { id: "b1", course: "Hip Hop Basics", session: "2025-09-10 18:00", status: "confirmed" },
];

function Mybookings() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Bookings</h1>
      <ul className="list-disc ml-6">
        {bookings.map((b) => (
          <li key={b.id}>
            {b.course} | {b.session} | Status: {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Mybookings;
