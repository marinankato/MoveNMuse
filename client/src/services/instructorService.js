// Jiayu
import { api } from "../api/api";

// support filtering/pagination
export function listInstructors(params) {
  return api.get("/instructors", params);
}

// detail
export function getInstructor(id) {
  return api.get(`/instructors/${id}`);
}

// create
export function createInstructor(payload) {
  // payload: { name, email, phone, bio, status }
  return api.post("/instructors", payload);
}

// update
export function updateInstructor(id, payload) {
  return api.put(`/instructors/${id}`, payload);
}

// delete
export function deleteInstructor(id) {
  return api.del(`/instructors/${id}`);
}
