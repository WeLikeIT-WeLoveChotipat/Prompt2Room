export const API_BASE = "http://127.0.0.1:8000";

export async function getMessage() {
  const res = await fetch(`${API_BASE}/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });
  return res.json();
}
