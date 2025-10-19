// src/components/SessionList.jsx
import PropTypes from "prop-types";

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" })
    .format(Number(n || 0));

export default function SessionList({ sessions = [], onAddToCart  }) {
  if (!sessions.length) return <div className="text-gray-500 text-sm">No upcoming sessions</div>;
  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const booked = Number(s.seatsBooked || 0);
        const capacity = Number(s.capacity || 0);
        const remaining = Math.max(capacity - booked, 0);
        return (
          <li key={s.sessionId} className="rounded-xl border p-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Session #{s.sessionId}</div>
              <div className="text-sm text-gray-600">
                {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Location: {s.location} · Price: {money(s.price)} · Booked: {booked} / Capacity: {capacity} (Remaining: {remaining})
              </div>
            </div>
            <div>
              <button
                className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
                onClick={() => onAddToCart?.(s)}
                disabled={remaining === 0}
              >
                {remaining === 0 ? "Full" : "Add to Cart"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

SessionList.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      sessionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
      location: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      seatsBooked: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  onAddToCart: PropTypes.func, // optional
};


