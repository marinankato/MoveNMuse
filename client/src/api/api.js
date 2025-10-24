// Shirley, Xinyi, Jiayu, Marina
const BASE = "/api"; 

async function request(path, { method = "GET", params, body, headers } = {}) {
  let url = path.startsWith("http") ? path : `${BASE}${path}`;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.trim() !== "") qs.set(k, v);
    });
    url += `?${qs.toString()}`;
  }
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok)
    throw new Error(text || `${method} ${url} failed: ${res.status}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: (path, params) => request(path, { method: "GET", params }),
  post: (path, body) => request(path, { method: "POST", body }),
  del: (path) => request(path, { method: "DELETE" }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
};
