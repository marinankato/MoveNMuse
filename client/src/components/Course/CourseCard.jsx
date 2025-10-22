// src/components/CourseCard.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" })
    .format(Number(n || 0));

export default function CourseCard({ c }) {
  return (
    <li className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all">
      <h3 className="text-lg font-semibold">{c.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{c.description}</p>

      <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
        {c.category && (
          <span className="rounded-full border px-2 py-0.5">{c.category}</span>
        )}
        {c.level && <span>{c.level}</span>}
        <span>{money(c.price)}</span>
        {c.nextStartTime && (
          <span>Next Start {new Date(c.nextStartTime).toLocaleString()}</span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          className="inline-block rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
          to={`/courses/${c.courseId}`}
        >
          View Details
        </Link>
        {c.lowCapacity && (
          <span className="text-xs text-red-600">Limited Spots</span>
        )}
      </div>
    </li>
  );
}

CourseCard.propTypes = {
  c: PropTypes.shape({
    courseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    level: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nextStartTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    lowCapacity: PropTypes.bool, 
  }).isRequired,
};





