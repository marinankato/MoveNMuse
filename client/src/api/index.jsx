
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }

  if (!res.ok) {
    throw new Error(data?.error || `${res.status} ${res.statusText}`);
  }
  return data;
}


export const api = {
 
  listCourses: (params = {}) => {
    const url = new URL(API_BASE + "/courses", window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length) {
        url.searchParams.set(k, v);
      }
    });
    
    return request("/courses?" + url.searchParams.toString());
  },
  getCourse: (id) => request(`/courses/${id}`),


  createBooking: ({ userId, courseId }) =>
    request(`/bookings`, {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    }),


  listBookingsByUser: (userId) => request(`/bookings/user/${userId}`),
};

