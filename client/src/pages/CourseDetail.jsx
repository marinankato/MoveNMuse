// src/pages/CourseDetail.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../services/courseService";
import { bookSession } from "../services/sessionService";
import SessionList from "../components/Course/SessionList.jsx";

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(Number(n || 0));

export function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [course, setCourse] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const r = await getCourse(id);
      setCourse(r);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]); //  no more missing dependency warning

  async function onBook(sessionId) {
    try {
      await bookSession(sessionId);
      await refresh();
      alert("Booking successful");
    } catch (e) {
      alert(e.message || "Booking failed");
    }
  }

  if (loading) return <div className="p-4 text-gray-600">Loading course…</div>;
  if (err)
    return (
      <div className="p-4 text-red-600">
        {err}
        <div>
          <button
            className="mt-2 rounded-lg border px-3 py-1 text-sm"
            onClick={() => nav(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  if (!course) return <div className="p-4">Course not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <button
        className="mb-3 rounded-lg border px-3 py-1 text-sm"
        onClick={() => nav(-1)}
      >
        ← Back
      </button>

      <div className="flex items-start gap-4">
        <div className="w-44 h-44 rounded-xl bg-gray-100 grid place-items-center text-sm text-gray-400">
          No Image
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.name}</h1>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            {course.description}
          </p>
          <div className="mt-3 text-xs text-gray-500 flex flex-wrap items-center gap-2">
            {course.category && (
              <span className="rounded-full border px-2 py-0.5">
                {course.category}
              </span>
            )}
            {course.level && <span>{course.level}</span>}
            <span>Price {money(course.price)}</span>
            {Number.isFinite(course.capacity) && (
              <span>Capacity per session {course.capacity}</span>
            )}
            <span>Remaining {Number(course.remaining || 0)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        <div className="mt-3">
          <SessionList sessions={course.upcomingSessions || []} onBook={onBook} />
        </div>
      </div>
    </div>
  );
}











