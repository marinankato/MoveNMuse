const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : API_BASE.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);

  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
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
    throw new Error(data?.error || data?.message || `${res.status} ${res.statusText}`);
  }
  return data;
}

export const api = {
  login: ({ email, password }) =>
    request(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getUserProfile: () =>
    request("/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }),

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

  getCourseSession: (sessionId) => {
    if (!sessionId) throw new Error("Invalid session ID");
    return request(`/course-sessions/${sessionId}`);
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
    return request(`/bookings?userId=${encodeURIComponent(userId)}`);
  },
// cart APIs
  getCartById: (userId) => request(`/cart/${userId}`),

  removeCartItem: ({ cartId, itemId }) =>
    request(`/cart/${cartId}/${itemId}`, {
      method: "DELETE",
    }),

  removeMultipleCartItems: ({ cartId, itemIds }) =>
    request(`/cart/removeItems`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, itemIds }),
    }),

  updateCartItem: ({ cartId, itemId, occurrenceId }) =>
    request(
      `/cart/${encodeURIComponent(cartId)}/${encodeURIComponent(itemId)}`,
      {
        method: "PUT",
        body: JSON.stringify({ occurrenceId }),
      }
    ),
    // payment APIs
  getPaymentHistoryById: (userId) =>
    request(`/payment/getPayments?userId=${encodeURIComponent(userId)}`),

  getAllPaymentHistory: () => request(`/payment/getAllPayments`),

  processPayment: ({ orderId, amount, userId, paymentDetailId }) =>
    request(`/payment/processPayment`, {
      method: "POST",
      body: JSON.stringify({ orderId, amount, userId, paymentDetailId }),
    }),
    
    // payment detail APIs
  getPaymentDetails: (userId) =>
    request(`/paymentDetail?userId=${encodeURIComponent(userId)}`),

  addPaymentDetail: (payload) =>
    request(`/paymentDetail/addPaymentDetail`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  setDefaultPaymentDetail: ({ userId, paymentDetailId }) =>
    request(`/paymentDetail/setDefault`, {
      method: "POST",
      body: JSON.stringify({ userId, paymentDetailId }),
    }),

deletePaymentDetail: (paymentDetailId) =>
  request(`/paymentDetail/${encodeURIComponent(paymentDetailId)}`, {
    method: "DELETE",
  }),

    // account APIs

  getAccount: () =>
    request(`/account`, {
      method: "GET",
  }),

  updateAccount: (payload) =>
    request(`/account`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

    registerUser: (formData) =>
      request(`/user/register`, {
        method: "POST",
        body: JSON.stringify(formData),
    }),

    changePassword: (formData) =>
      request(`/user/changePassword`, {
        method: "POST",
        body: JSON.stringify(formData),
    }),

    getBookingDetails: (bookingId) =>
      request(`/bookings/${bookingId}`, {
        method: "GET",
  })
};

export { request };
