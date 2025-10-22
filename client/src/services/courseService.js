// src/services/courseService.js
import { api } from "../api/api";

// List: 支持 kw / category / level / page / pageSize
export function listCourses(params) {
  return api.get("/courses", params);
  // return api.get("/courses/open", params);
}

// Detail: :id 可为 courseId 或 ObjectId
export function getCourse(id) {
  return api.get(`/courses/${id}`);
}

// Create: 新建课程（staff 权限）
// payload = { name, description, price, capacity, category, level }
export function createCourse(payload) {
  return api.post("/courses", payload);
}

// Update: 修改课程信息

export function updateCourse(courseId, payload) {
  return api.put(`/courses/${courseId}`, payload);
}

// Delete: 删除课程
export function deleteCourse(courseId) {
  return api.del(`/courses/${courseId}`);
}


