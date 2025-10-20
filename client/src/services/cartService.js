// src/services/cartService.js
import { getToken, getUserIdFromToken } from "../utils/auth";

const API_BASE = (import.meta.env?.VITE_API_BASE || "/api").replace(/\/$/, "");

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

//if the backend uses token to identify user
export function addCartItemByToken({ productId, occurrenceId, title, price }) {
  return request("/cart/items", {
    method: "POST",
    body: { productType: "Course", productId, occurrenceId, title, price },
  });
}

//if student implemented /cart/:userId/items
export function addCartItemByUserId({ productId, occurrenceId, title, price }) {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("User not logged in");
  return request(`/cart/${encodeURIComponent(userId)}/items`, {
    method: "POST",
    body: { productType: "Course", productId, occurrenceId, title, price },
  });
}
