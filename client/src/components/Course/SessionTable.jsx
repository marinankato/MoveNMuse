// src/components/SessionTable.jsx
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function SessionTable({ sessions, onDelete }) {
  const navigate = useNavigate();

  const formatDate = (str) => {
    const d = new Date(str);
    if (isNaN(d)) return "-";
    return d.toLocaleString();
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800">Session List</h3>
        <button
          onClick={() => navigate("/admin/sessions")}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
        >
          Go to All Sessions
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Session ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Course ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Instructor ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Start Time</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">End Time</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Seats</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {sessions.map((s) => (
            <tr key={s._id || s.sessionId} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{s.sessionId}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.courseId}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{s.instructorId}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{formatDate(s.startTime)}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{formatDate(s.endTime)}</td>
              <td className="px-4 py-2 text-center text-sm text-gray-700">
                {s.seatsBooked ?? 0}/{s.capacity ?? "-"}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : s.status === "Completed"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => navigate(`/admin/sessions/${s._id || s.sessionId}/edit`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(s._id || s.sessionId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sessions.length === 0 && (
        <div className="p-6 text-center text-gray-500">No sessions found.</div>
      )}
    </div>
  );
}

SessionTable.propTypes = {
  sessions: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
};

