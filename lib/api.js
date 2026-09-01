const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.detail
      ? typeof data.detail === "string"
        ? data.detail
        : data.detail.error || JSON.stringify(data.detail)
      : data.error || "Something went wrong.";
    throw new Error(message);
  }
  return data;
}

// Separate from api() because file uploads must NOT set a JSON Content-Type header —
// the browser needs to set its own multipart boundary.
export async function apiUpload(path, file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.detail
      ? typeof data.detail === "string"
        ? data.detail
        : data.detail.error || JSON.stringify(data.detail)
      : data.error || "Upload failed.";
    throw new Error(message);
  }
  return data;
}

// Uploaded images come back as "/uploads/xyz.jpg" — a path on the BACKEND, not
// the frontend. Resolve it to a full URL; leave already-absolute URLs alone.
export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url}`;
}
