// src/utils/auth.js
export function getToken() {
  return localStorage.getItem("token") || null;
}

// Only used in "temporary backend" scenarios where the userId path param is required;
// If the backend uses the token to identify the user, this is only used for frontend login status checks.
export function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.id ?? null;
  } catch {
    return null;
  }
}
