// src/components/SessionList.jsx
import PropTypes from "prop-types";

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(Number(n || 0));

export default function SessionList({ sessions = [], onAddToCart, role = null, canBook }) {
  if (!sessions.length) return <div className="text-gray-500 text-sm">No upcoming sessions</div>;

  const now = new Date();

  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const booked    = Number(s.seatsBooked ?? 0);
        const capacity  = Number(s.capacity ?? 0);
        const remaining = Math.max(capacity - booked, 0);
        const start     = new Date(s.startTime);

        // caculate reasons why not bookable
        const reasons = [];
        if (s.status && s.status !== "Scheduled") reasons.push("Not scheduled");
        if (start <= now) reasons.push("Started");
        if (capacity > 0 && remaining <= 0) reasons.push("Full");

        //if role is not customer, block purchase
        const roleBlocksPurchase = role && role !== "customer";

        // determine if bookable
        const bookable = canBook ? canBook(s) : remaining > 0;
        const disabled = roleBlocksPurchase || !bookable;

        let label = "Add to Cart";
        if (roleBlocksPurchase) label = "View only";
        else if (reasons.includes("Started")) label = "Started";
        else if (reasons.includes("Not scheduled")) label = "Unavailable";
        else if (reasons.includes("Full")) label = "Full";

        const hint =
          roleBlocksPurchase
            ? "Only customers can add items to the cart."
            : reasons.join(" · ");

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
              {/* show hint if disabled */}
              {disabled && hint && (
                <div className="text-xs text-amber-700 mt-1">
                  {hint}
                </div>
              )}
            </div>
            <div>
              <button
                className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
                onClick={() => !disabled && onAddToCart?.(s)}
                disabled={disabled}
                title={hint || ""}
              >
                {label}
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
      status: PropTypes.string, // e.g., "Scheduled", "Cancelled"
    })
  ).isRequired,
  onAddToCart: PropTypes.func,        // optional
  role: PropTypes.string,             // "customer" | "staff" | null
  canBook: PropTypes.func,            // (session) => boolean
};



