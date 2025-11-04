export const API_BASE = "http://127.0.0.1:8000";
import { supabase } from "@/lib/supabaseClient";

export async function getMessage() {
  const res = await fetch(`${API_BASE}/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });
  return res.json();
}

export async function filterMessage(message: string) {
  const res = await fetch(`${API_BASE}/filter`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"txt": message}),
  });
  return res.json();
}

export async function generateResponse(original_prompt: string,prompt: string ,userId: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No Login");
  }

  const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_prompt: original_prompt,
          txt: prompt,
          user_id: userId
        }),
      });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${res.status} ${text}`);
  }

  return res.json();
}