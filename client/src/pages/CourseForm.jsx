// src/pages/CourseForm.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourse, createCourse, updateCourse } from "../services/courseService";
import { getRoleFromToken, getToken } from "../utils/auth";

export default function CourseForm() {
  const { id } = useParams(); // courseId
  const isEdit = !!id;
  const nav = useNavigate();
  const loc = useLocation();
  const role = (getRoleFromToken?.() || "").toLowerCase();
  const isStaff = role === "staff";

  const search = new URLSearchParams(loc.search);
  const returnTo = search.get("return"); // optional: return to a specific page after

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    // capacity: "",
    category: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getCourse(id)
      .then((c) => {
        setForm({
          name: c.name || c.title || "",
          description: c.description || "",
          price: ("price" in c) ? c.price : "",
          category: c.category || "",
          level: c.level || "",
        });
      })
      .catch((e) => setErr(e.message || "Failed to load course"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  if (!isStaff) return <div className="p-6 text-red-600">Forbidden — Staff only.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const goBack = () => {
    if (returnTo) nav(returnTo);
    else if (isEdit) nav(`/courses/${encodeURIComponent(id)}`);
    else nav("/admin/courses");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const token = getToken?.();
      if (!token) {
        alert("Please login as staff.");
        nav("/login", { replace: false, state: { redirectTo: location.pathname } });
        return;
      }
      const payload = {
        name: form.name?.trim(),
        description: form.description?.trim(),
        price: form.price !== "" ? Number(form.price) : undefined,
        category: form.category?.trim(),
        level: form.level?.trim(),
      };

      if (isEdit) {
        await updateCourse(id, payload, token);
        alert("Course updated.");
      } else {
        const created = await createCourse(payload, token);
        alert("Course created.");
        // create success redirect
        const cid = created?.courseId ?? null;
        if (returnTo) {
          nav(returnTo);
          return;
        }
        if (cid) {
          nav(`/courses/${encodeURIComponent(cid)}`);
          return;
        }
        nav("/admin/courses");
        return;
      }

      // after update redirect
      if (returnTo) nav(returnTo);
      else nav(`/courses/${encodeURIComponent(id)}`);
    } catch (e) {
      setErr(e.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Course" : "Create New Course"}
      </h1>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Contemporary Dance (Beginner)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Course overview, requirements, who it's for…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium mb-1">Category</span>
            <input
              className="w-full border rounded px-3 py-2"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Dance / Yoga / Workshop"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-1">Level</span>
            <input
              className="w-full border rounded px-3 py-2"
              name="level"
              value={form.level}
              onChange={handleChange}
              placeholder="e.g. Beginner / Intermediate / Advanced"
            />
          </label>
        </div>

                <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium mb-1">Price (AUD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 49.00"
            />
          </label>

          {/* <label className="block">
            <span className="block text-sm font-medium mb-1">Capacity (per session)</span>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 20"
            />
          </label> */}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={goBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
