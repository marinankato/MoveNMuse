// src/services/sessionService.js
import { api } from "../api/api";

// The course detail response already includes upcomingSessions; 
// use this if you need a custom time window.
export function listSessions(params) {
  return api.get("/course-sessions", params); // e.g., { courseId, from, to }
}

export function bookSession(sessionId) {
  return api.post(`/course-sessions/${sessionId}/book`);
}

export function cancelSession(sessionId) {
  return api.post(`/course-sessions/${sessionId}/cancel`);
}

