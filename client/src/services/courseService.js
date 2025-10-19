// src/services/courseService.js
import { api } from "../api/api";

// List: supports kw/category/level/page/pageSize
export function listCourses(params) {
  return api.get("/courses", params);
  // Public endpoint (accessible without login) can be switched to:
  // return api.get("/courses/open", params);
}

// Detail: :id supports either numeric courseId or 24-character ObjectId (handled by backend routing)
export function getCourse(id) {
  return api.get(`/courses/${id}`);
}

