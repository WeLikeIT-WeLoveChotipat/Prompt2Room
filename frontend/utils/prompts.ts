import { supabase } from "@/lib/supabaseClient"

export type PromptRow = {
  id: number
  user_id: string
  prompt: string
  image: string | null
  created_at: string
}

export async function insertPrompt(text: string, imageUrl?: string | null) {
  const clean = text.trim()
  if (!clean) throw new Error("prompt is required")

  const { data: { user }, error: uerr } = await supabase.auth.getUser()
  if (uerr || !user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("prompts")
    .insert({ user_id: user.id, prompt: clean, image: imageUrl || null })
    .select("*")
    .single()

  if (error) {
    console.error("Supabase insert error:", error)
    throw error
  }
  return data as PromptRow
}

export async function listStoragePrompts() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data || []) as PromptRow[]
}

export async function deletePrompt(id: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not signed in")

  const { error } = await supabase.from("prompts").delete().eq("id", id)
  if (error) throw error
}
