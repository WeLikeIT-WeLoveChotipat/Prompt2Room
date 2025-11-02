export const API_BASE = "http://127.0.0.1:8000";
import { fetchCache } from '../.next/server/chunks/b6e69_next_b144bc3d._';

export async function getMessage() {
  const res = await fetch(`${API_BASE}/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });
  return res.json();
}

export async function filterMessage(message:String) {
  const res = await fetch(`${API_BASE}/filter`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"txt": message}),
  });
  return res.json();
} 

export async function generateResponse(params:String) {
  const res  = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"txt": params}),
  })
  return res.json();
}