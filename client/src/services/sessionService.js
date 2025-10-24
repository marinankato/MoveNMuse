// Jiayu
import { api } from "../api/api";   

const BASE = "/course-sessions";

// columnlist support filtering/pagination:
export function listSessions({ limit = 50, courseId } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (courseId !== undefined && courseId !== null && `${courseId}` !== "") {
    params.set("courseId", String(courseId));
  }
  return api.get(`${BASE}?${params.toString()}`);
}

// detail
export function getSession(id) {
  return api.get(`${BASE}/${id}`);
}

// by course
export function getSessionsByCourse(courseId) {
  return api.get(`${BASE}/course/${courseId}`);
}

// Staff：create
export function createSession(payload) {
  return api.post(BASE, payload);
}

// Staff：update
export function updateSession(id, payload) {
  return api.patch(`${BASE}/${id}`, payload);
}

// Staff：delete
export function deleteSession(id) {
  return api.del(`${BASE}/${id}`);
}

// Book a seat
export function bookSeat(id) {
  return api.post(`${BASE}/${id}/book`);
}
export function cancelSeat(id) {
  return api.post(`${BASE}/${id}/cancel`);
}



