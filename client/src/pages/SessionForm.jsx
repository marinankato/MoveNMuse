// Jiayu
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { listInstructors } from "../services/instructorService";

import {
  getSession,
  createSession,
  updateSession,
} from "../services/sessionService";

export default function SessionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = !!id;

  // read query params
  const search = new URLSearchParams(location.search);
  const qCourseId = search.get("courseId");
  const returnTo = search.get("return");

  const [form, setForm] = useState({
    courseId: isEdit ? "" : qCourseId || "",
    instructorId: "",
    startTime: "",
    endTime: "",
    capacity: "",
    price: "",
    location: "",
    status: "Scheduled",
  });

  const [loading, setLoading] = useState(false); // form submission loading state
  const [err, setErr] = useState("");
  const [originalCourseId, setOriginalCourseId] = useState(null);

  // instructors state
  const [instructors, setInstructors] = useState([]);
  const [insLoading, setInsLoading] = useState(false);
  const [insErr, setInsErr] = useState("");

  // load instructors (for dropdown)
  useEffect(() => {
    let dead = false;
    (async () => {
      setInsLoading(true);
      setInsErr("");
      try {
        const r = await listInstructors({ page: 1, pageSize: 200 });
        const list = Array.isArray(r) ? r : r.items || [];
        if (!dead) setInstructors(list);
      } catch (e) {
        if (!dead) {
          setInstructors([]); // fallback to manual input
          setInsErr(e.message || "Failed to load instructors");
        }
      } finally {
        if (!dead) setInsLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  // load existing session data if editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getSession(id)
      .then((data) => {
        // helper to convert date to local datetime-local input format
        const toLocalInput = (d) => {
          if (!d) return "";
          const dt = new Date(d);
          const pad = (n) => String(n).padStart(2, "0");
          const yyyy = dt.getFullYear();
          const mm = pad(dt.getMonth() + 1);
          const dd = pad(dt.getDate());
          const hh = pad(dt.getHours());
          const mi = pad(dt.getMinutes());
          return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
        };

        setForm({
          courseId: data.courseId ?? "",
          instructorId: data.instructorId ?? "",
          startTime: toLocalInput(data.startTime),
          endTime: toLocalInput(data.endTime),
          capacity: data.capacity ?? "",
          price:
            typeof data.price === "object" && data.price?.$numberDecimal
              ? data.price.$numberDecimal
              : data.price ?? "",
          location: data.location ?? "",
          status: data.status ?? "Scheduled",
        });
        setOriginalCourseId(data.courseId ?? null); // record original courseId for redirecting back to details page
      })
      .catch((e) => setErr(e.message || "Failed to load session"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // unified form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // simple validation: end time must be later than start time
  const validateTimes = () => {
    const start = new Date(form.startTime).getTime();
    const end = new Date(form.endTime).getTime();
    if (!isFinite(start) || !isFinite(end))
      return "Please provide valid start/end times.";
    if (end <= start) return "End time must be later than start time.";
    return "";
  };

  // unified redirect strategy
  const goAfterSaveOrBack = () => {
    if (returnTo) {
      navigate(returnTo);
      return;
    }
    if (isEdit && originalCourseId) {
      navigate(`/courses/${encodeURIComponent(originalCourseId)}`);
      return;
    }
    if (!isEdit && qCourseId) {
      navigate(`/courses/${encodeURIComponent(qCourseId)}`);
      return;
    }
    navigate("/admin/sessions");
  };

  // pre-compute negative checks
  const capNeg =
    String(form.capacity).trim() !== "" && Number(form.capacity) < 0;
  const priceNeg = String(form.price).trim() !== "" && Number(form.price) < 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // time validation
    const timeErr = validateTimes();
    if (timeErr) {
      setErr(timeErr);
      return;
    }

    // number validation (prevent negative values)
    if (capNeg) {
      setErr("Capacity cannot be negative.");
      return;
    }
    if (priceNeg) {
      setErr("Price cannot be negative.");
      return;
    }

    setLoading(true);
    // prepare payload and call create/update API
    try {
      const start = new Date(form.startTime);
      const end = new Date(form.endTime);
      const duration = Math.max(0, Math.round((end - start) / (1000 * 60))); 

      const payload = {
        ...form,
        courseId: Number(form.courseId),
        instructorId: Number(form.instructorId),
        capacity: Number(form.capacity),
        price: form.price !== "" ? Number(form.price) : undefined,
        startTime: start,
        endTime: end,
        duration,
        location: form.location?.trim(),
      };

      if (isEdit) {
        await updateSession(id, payload);
        alert("Session updated successfully!");
      } else {
        await createSession(payload);
        alert("Session created successfully!");
      }
      // redirect after save
      goAfterSaveOrBack();
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    goAfterSaveOrBack();
  };
  // render form
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        {isEdit ? "Edit Course Session" : "Create New Course Session"}
      </h1>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course ID
          </label>
          <input
            type="number"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter Course ID"
            disabled={!isEdit && !!qCourseId}
          />
          {!isEdit && !!qCourseId && (
            <p className="text-xs text-gray-500 mt-1">
              Pre-filled from Course Detail (courseId={qCourseId})
            </p>
          )}
        </div>

        {/* Instructor select with graceful fallback */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/instructors?return=${encodeURIComponent(
                    location.pathname + location.search
                  )}`
                )
              }
              className="text-xs underline text-blue-600 hover:text-blue-800"
              title="Manage instructors"
            >
              Manage Instructors
            </button>
          </div>

          {instructors.length > 0 ? (
            <select
              name="instructorId"
              value={form.instructorId}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select an instructor</option>
              {instructors.map((ins) => (
                <option
                  key={ins._id || ins.instructorId}
                  value={ins.instructorId || ins._id}
                >
                  {ins.name} {ins.email ? `(${ins.email})` : ""}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="number"
                name="instructorId"
                value={form.instructorId}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
                placeholder={
                  insLoading ? "Loading instructors…" : "Enter Instructor ID"
                }
              />
              {insErr && (
                <p className="text-xs text-amber-700 mt-1">
                  {insErr} — fallback to manual input.
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              required
              min="1"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Total capacity (≥ 1)"
            />
            {capNeg && (
              <p className="text-xs text-red-600 mt-1">
                Capacity cannot be less than 1.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (optional)
            </label>
            <input
              type="number"
              step="1"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              inputMode="decimal"
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. 39.99 (≥ 0)"
            />
            {priceNeg && (
              <p className="text-xs text-red-600 mt-1">
                Price cannot be less than 0.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g. Studio C — Dance Room"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
