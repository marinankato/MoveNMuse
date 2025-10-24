// Jiayu
import { api } from "../api/api";
import { getToken } from "../utils/auth";

// taken from auth.js for authenticated requests
async function authRequest(path, { method = "GET", body, token } = {}) {
  const auth = token || getToken();
  const res = await fetch(path.startsWith("/api") ? path : `/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const j = text ? JSON.parse(text) : {};
      throw new Error(j.message || j.error || `HTTP ${res.status}`);
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

// support listing with optional filters
export function listCourses(params) {
  return api.get("/courses", params);
}

//details by id
export function getCourse(id) {
  return api.get(`/courses/${id}`);
}

// create new course (needs staff auth)
export function createCourse(payload, token) {
  return authRequest("/api/courses", { method: "POST", body: payload, token });
}

// update course by id (needs staff auth)
export function updateCourse(courseId, payload, token) {
  return authRequest(`/api/courses/${encodeURIComponent(courseId)}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

//  delete course by id (needs staff auth)
export function deleteCourse(courseId, token) {
  return authRequest(`/api/courses/${encodeURIComponent(courseId)}`, {
    method: "DELETE",
    token,
  });
}




