// src/utils/auth.js
export function getToken() {
  return localStorage.getItem("token") || null;
}

//decodes a base64url string
function base64UrlDecode(input) {
  try {
    let str = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = str.length % 4;
    if (pad) str += "=".repeat(4 - pad);
    return atob(str);
  } catch {
    return null;
  }
}

//parses the JWT token payload
export function getTokenPayload() {
  const token = getToken();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const decoded = base64UrlDecode(parts[1]);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}


export function getUserIdFromToken() {
  const payload = getTokenPayload();
  return payload?.id ?? payload?.sub ?? null;
}

//gets the user role from the token payload
export function getRoleFromToken() {
  const payload = getTokenPayload();
  return payload?.role ?? null;
}

//checks if the token is expired based on the exp claim
export function isTokenExpired() {
  const payload = getTokenPayload();
  if (!payload?.exp) return false; // no exp claim means no expiration
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

//checks if the user is logged in (token exists and not expired)
export function isLoggedIn() {
  const token = getToken();
  return Boolean(token) && !isTokenExpired();
}

//generates the Authorization header for authenticated requests
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

//role checking functions
export function isCustomer() {
  return getRoleFromToken() === "customer";
}
export function isStaff() {
  return getRoleFromToken() === "staff";
}

