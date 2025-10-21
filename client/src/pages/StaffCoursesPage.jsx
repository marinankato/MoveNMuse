// src/pages/StaffCoursesPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCourses, deleteCourse } from "../services/courseService";
import { getRoleFromToken, getToken } from "../utils/auth";

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(Number(n || 0));

export default function StaffCoursesPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const role = (getRoleFromToken?.() || "").toLowerCase();
  const isStaff = role === "staff";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listCourses({ limit: 200, sort: "-createdAt" });
      // 兼容返回结构：数组或 {items:[]}
      const list = Array.isArray(data) ? data : data.items || [];
      setItems(list);
    } catch (e) {
      setErr(e.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  async function handleDelete(courseId) {
    if (!confirm(`Delete course ${courseId}? This cannot be undone.`)) return;
    try {
      const token = getToken?.();
      if (!token || !isStaff) {
        alert("Only staff can delete courses.");
        return;
      }
      await deleteCourse(courseId, token);
      // 立即更新 UI
      setItems((prev) => prev.filter((c) => (c._id || c.courseId) !== courseId && c.courseId !== courseId));
      // 或者强制刷新
      // setRefreshKey(k => k + 1);
      alert("Deleted.");
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  if (!isStaff) return <div className="p-6 text-red-600">Forbidden — Staff only.</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Courses</h1>
        <button
          onClick={() => nav("/admin/courses/new")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          + New Course
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && items.length === 0 && (
        <div className="p-6 text-gray-500">No courses found.</div>
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Course ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Level</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Capacity</th>
                <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((c) => (
                <tr key={c._id || c.courseId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{c.courseId}</td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      className="underline"
                      onClick={() => nav(`/courses/${c.courseId}`)}
                      title="View detail"
                    >
                      {c.name || c.title || "(no name)"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm">{c.category || "-"}</td>
                  <td className="px-4 py-2 text-sm">{c.level || "-"}</td>
                  <td className="px-4 py-2 text-sm">{("price" in c) ? money(c.price) : "-"}</td>
                  <td className="px-4 py-2 text-sm">{Number.isFinite(c.capacity) ? c.capacity : "-"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => nav(`/admin/courses/${c.courseId}/edit`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.courseId)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 底部工具条：刷新 */}
          <div className="flex items-center justify-end px-4 py-3 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
