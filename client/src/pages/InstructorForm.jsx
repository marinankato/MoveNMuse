// src/pages/InstructorForm.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getInstructor, createInstructor, updateInstructor } from "../services/instructorService";
import { getRoleFromToken } from "../utils/auth";

export default function InstructorForm() {
  const { id } = useParams();            // instructorId or _id
  const isEdit = !!id;
  const nav = useNavigate();
  const loc = useLocation();

  const role = (getRoleFromToken?.() || "").toLowerCase();
  const isStaff = role === "staff";

  const search = new URLSearchParams(loc.search);
  const returnTo = search.get("return"); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    status: "Active", // Active / Inactive
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getInstructor(id)
      .then((d) => {
        setForm({
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          bio: d.bio || "",
          status: d.status || "Active",
        });
      })
      .catch((e) => setErr(e.message || "Failed to load instructor"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  if (!isStaff) return <div className="p-6 text-red-600">Forbidden — Staff only.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const goBack = () => {
    if (returnTo) nav(returnTo);
    else nav("/admin/instructors");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      if (isEdit) {
        await updateInstructor(id, {
          name: form.name?.trim(),
          email: form.email?.trim(),
          phone: form.phone?.trim(),
          bio: form.bio?.trim(),
          status: form.status,
        });
        alert("Instructor updated.");
      } else {
        await createInstructor({
          name: form.name?.trim(),
          email: form.email?.trim(),
          phone: form.phone?.trim(),
          bio: form.bio?.trim(),
          status: form.status,
        });
        alert("Instructor created.");
      }
      goBack();
    } catch (e2) {
      setErr(e2.message || "Failed to save instructor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Instructor" : "Create New Instructor"}
      </h1>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Name</span>
          <input
            className="w-full border rounded px-3 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Alex Chen"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Email</span>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="alex@example.com"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Phone</span>
          <input
            className="w-full border rounded px-3 py-2"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+61 ..."
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Bio</span>
          <textarea
            rows={4}
            className="w-full border rounded px-3 py-2"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Background, specialties, certifications…"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Status</span>
          <select
            className="w-full border rounded px-3 py-2"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <div className="flex justify-between mt-6">
          <button type="button" onClick={goBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            ← Back
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
