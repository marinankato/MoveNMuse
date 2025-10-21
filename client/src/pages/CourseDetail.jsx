// src/pages/CourseDetail.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// services
import { getCourse } from "../services/courseService";
import { getSessionsByCourse, deleteSession } from "../services/sessionService";

// 顾客视图（customer版）
import SessionList from "../components/Course/SessionList.jsx";
// staff 管理表（你当前在 Course 目录）
import SessionTable from "../components/Course/SessionTable.jsx";

// auth utils
import { getToken, getUserIdFromToken, getRoleFromToken } from "../utils/auth";

// money formatter
const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(Number(n || 0));

function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [course, setCourse] = useState(null);

  // sessions 分成两份：顾客用 upcoming；staff 用 all
  const [sessionsAll, setSessionsAll] = useState([]);
  const [sessionsUpcoming, setSessionsUpcoming] = useState([]);

  // edit course (staff only) modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    category: "",
    level: "",
  });

  const role = (getRoleFromToken?.() || "").toLowerCase();
  const isStaff = role === "staff";

  const courseIdNum = useMemo(() => {
    const num = Number(id);
    return Number.isFinite(num) ? num : id;
  }, [id]);

  function canBook(session) {
    if (!session) return false;
    const now = new Date();
    const start = new Date(session.startTime);
    const schedulable = (session.status ?? "Scheduled") === "Scheduled";
    const notStarted = start > now;
    const cap = Number(session.capacity ?? course?.capacity ?? 0);
    const booked = Number(session.seatsBooked ?? 0);
    const hasSeats = cap > 0 ? booked < cap : true;
    return schedulable && notStarted && hasSeats;
  }

  const refreshCourse = useCallback(async () => {
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

  const refreshSessions = useCallback(async (cid) => {
    try {
      const list = await getSessionsByCourse(cid);
      const normalized = (list || []).map((s) => ({
        ...s,
        price:
          typeof s.price === "object" && s.price?.$numberDecimal
            ? parseFloat(s.price.$numberDecimal)
            : Number(s.price),
      }));
      setSessionsAll(normalized);

      const now = Date.now();
      setSessionsUpcoming(normalized.filter((s) => new Date(s.endTime).getTime() > now));
    } catch (e) {
      console.error("load sessions failed:", e);
      setSessionsAll([]);
      setSessionsUpcoming([]);
    }
  }, []);

  useEffect(() => {
    refreshCourse();
  }, [refreshCourse]);

  useEffect(() => {
    const cid = course?.courseId ?? courseIdNum;
    if (!cid) return;
    refreshSessions(cid);
  }, [course?.courseId, courseIdNum, refreshSessions]);

  // open course edit modal (staff)
  function openEditModal() {
    if (!course) return;
    setForm({
      name: course.name || course.title || "",
      description: course.description || "",
      price: course.price ?? "",
      capacity: course.capacity ?? "",
      category: course.category || "",
      level: course.level || "",
    });
    setOpenEdit(true);
  }

  async function onSaveCourse() {
    try {
      setSaving(true);
      const token = getToken?.();
      if (!token || !isStaff) {
        alert("Only staff can edit courses.");
        return;
      }
      const API_BASE = (import.meta.env?.VITE_API_BASE || "/api").replace(/\/$/, "");
      const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(course.courseId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          capacity: Number(form.capacity),
          category: form.category,
          level: form.level,
        }),
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        nav("/login", { replace: false, state: { redirectTo: location.pathname } });
        return;
      }
      if (res.status === 403) {
        alert("You do not have permission to edit this course.");
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Update failed: ${res.status}`);
      }

      setOpenEdit(false);
      await refreshCourse();
    } catch (e) {
      alert(e.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  }

  async function onAddToCart(session) {
    try {
      const token = getToken?.();
      const userId = getUserIdFromToken?.();
      const r = (getRoleFromToken?.() || "").toLowerCase();

      if (!token || !userId) {
        alert("Please log in to add items to your cart.");
        nav("/login", { replace: false, state: { redirectTo: location.pathname } });
        return;
      }
      if (r !== "customer") {
        alert("Only customers can add items to the cart.");
        return;
      }
      if (!canBook(session)) {
        alert("This session cannot be booked (started / full / not scheduled).");
        return;
      }

      const API_BASE = (import.meta.env?.VITE_API_BASE || "/api").replace(/\/$/, "");
      const res = await fetch(`${API_BASE}/cart/${encodeURIComponent(userId)}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productType: "Course",
          productId: course.courseId,
          occurrenceId: session.sessionId,
        }),
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        nav("/login", { replace: false, state: { redirectTo: location.pathname } });
        return;
      }
      if (res.status === 403) {
        alert("You do not have permission to add items to the cart.");
        return;
      }
      if (res.status === 404) {
        alert("Shopping cart API is not ready yet. Please contact the Cart team or try later.");
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Add to cart failed: ${res.status}`);
      }

      alert("Added to cart successfully");
      nav("/cart");
    } catch (e) {
      alert(e.message || "Failed to add to cart");
    }
  }

  async function handleDeleteSession(sessionId) {
    try {
      const token = getToken?.();
      if (!token || !isStaff) {
        alert("Only staff can delete sessions.");
        return;
      }
      if (!confirm(`Delete session ${sessionId}? This cannot be undone.`)) return;

      await deleteSession(sessionId);

      const cid = course?.courseId ?? courseIdNum;
      await refreshSessions(cid);
      alert("Deleted.");
    } catch (e) {
      console.error(e);
      alert(e?.message || "Delete failed");
    }
  }

  function goCreateSession() {
    const ret = encodeURIComponent(location.pathname);
    const cid = course?.courseId ?? courseIdNum;
    nav(`/admin/sessions/new?courseId=${cid}&return=${ret}`);
  }

  if (loading) return <div className="p-4 text-gray-600">Loading course…</div>;

  if (err)
    return (
      <div className="p-4 text-red-600">
        {err}
        <div>
          <button className="mt-2 rounded-lg border px-3 py-1 text-sm" onClick={() => nav(-1)}>
            Back
          </button>
        </div>
      </div>
    );

  if (!course) return <div className="p-4">Course not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <button className="mb-3 rounded-lg border px-3 py-1 text-sm" onClick={() => nav(-1)}>
        ← Back
      </button>

      {/* only visible for staff */}
      {isStaff && (
        <div className="mb-4 rounded-lg border p-3 bg-amber-50 text-amber-900">
          <div className="font-semibold mb-2">Staff Tools</div>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1 text-sm" onClick={openEditModal}>
              ✏️ Edit Course Info
            </button>
          </div>
        </div>
      )}

      {/* 课程信息 */}
      <div className="flex items-start gap-4">
        <div className="w-44 h-44 rounded-xl bg-gray-100 grid place-items-center text-sm text-gray-400">
          No Image
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.name || course.title || `Course ${id}`}</h1>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">{course.description}</p>
          <div className="mt-3 text-xs text-gray-500 flex flex-wrap items-center gap-2">
            {course.category && <span className="rounded-full border px-2 py-0.5">{course.category}</span>}
            {course.level && <span>{course.level}</span>}
            {"price" in course && <span>Price {money(course.price)}</span>}
            {Number.isFinite(course.capacity) && <span>Capacity per session {course.capacity}</span>}
            {"remaining" in course && <span>Remaining {Number(course.remaining || 0)}</span>}
          </div>
        </div>
      </div>

      {/* 顾客视图：仅非 staff 可见 */}
      {!isStaff && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <div className="mt-3">
            <SessionList
              sessions={sessionsUpcoming} // 顾客只看 upcoming
              onAddToCart={onAddToCart}
              canBook={canBook}
              role={role || null}
            />
          </div>
        </div>
      )}

      {/* Staff 管理区（仅 staff 可见）：显示本课程的全部 sessions */}
      {isStaff && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manage Sessions (this course)</h2>
            <button
              className="rounded bg-black text-white px-3 py-1 text-sm"
              onClick={goCreateSession}
            >
              ＋ New Session
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Only visible to staff. All sessions (including past/cancelled) for this course.
          </p>

          <div className="mt-3">
            <SessionTable
              sessions={sessionsAll} // staff 看全部
              onDelete={handleDeleteSession}
              // 编辑按钮在 SessionTable 内部应跳到 /admin/sessions/:id/edit
            />
          </div>
        </section>
      )}

      {/* Edit Course Modal */}
      {openEdit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Course</h3>
              <button className="text-sm opacity-70" onClick={() => setOpenEdit(false)}>
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="col-span-2 text-sm">
                <span className="block mb-1">Name</span>
                <input
                  className="w-full rounded border px-2 py-1"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>

              <label className="col-span-2 text-sm">
                <span className="block mb-1">Description</span>
                <textarea
                  className="w-full rounded border px-2 py-1"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-1">Price (AUD)</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded border px-2 py-1"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-1">Capacity per session</span>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded border px-2 py-1"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-1">Category</span>
                <input
                  className="w-full rounded border px-2 py-1"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
              </label>

              <label className="text-sm">
                <span className="block mb-1">Level</span>
                <input
                  className="w-full rounded border px-2 py-1"
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => setOpenEdit(false)}>
                Cancel
              </button>
              <button
                className="rounded bg-black text-white px-3 py-1 text-sm disabled:opacity-50"
                onClick={onSaveCourse}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CourseDetail };
export default CourseDetail;
















