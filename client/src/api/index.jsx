

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : API_BASE.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    throw new Error(data?.error || `${res.status} ${res.statusText}`);
  }
  return data;
}

export const api = {
  listCourses: (params = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim().length > 0) {
        sp.set(k, v);
      }
    });
    const qs = sp.toString();
    return request(`/courses${qs ? "?" + qs : ""}`);
  },

  getCourse: (id) => {
    if (!id) throw new Error("Invalid course ID");
    return request(`/courses/${encodeURIComponent(id)}`);
  },

  createBooking: ({ userId, courseId }) => {
    if (!userId || !courseId) throw new Error("Invalid booking data");
    return request(`/bookings`, {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    });
  },

  listBookingsByUser: (userId) => {
    if (!userId) throw new Error("Invalid user ID");
    return request(`/bookings/user/${encodeURIComponent(userId)}`);
  },
};


