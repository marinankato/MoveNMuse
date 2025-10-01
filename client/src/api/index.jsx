// 如果前后端不同端口，推荐在 vite.config.js 里做 /api 代理；
// 或者把 VITE_API_BASE 设置成 http://localhost:5000/api
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "请求失败");
  return data;
}

export const api = {
  // 课程相关
  listCourses: (params = {}) => {
    const url = new URL(API_BASE + "/courses", window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length) {
        url.searchParams.set(k, v);
      }
    });
    // 注意：这里把完整 URL 拆回给 request（因为 request 会再拼 API_BASE）
    return request("/courses?" + url.searchParams.toString());
  },
  getCourse: (id) => request(`/courses/${id}`),

  // 预约（BookingCourse）
  createBooking: ({ userId, courseId }) =>
    request(`/bookings`, {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    }),

  // 查看我的预约（按用户）
  listBookingsByUser: (userId) => request(`/bookings/user/${userId}`),
};

