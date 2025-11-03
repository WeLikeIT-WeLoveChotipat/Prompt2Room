import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type StoragePromptsProps  = {
  id: number;
  prompt: string;
  image_url: string | null;
  created_at: string;
};

export default function StoragePrompts() {
  const [rows, setRows] = useState<StoragePromptsProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("prompts")
      .select("id, prompt, image_url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRows(data as StoragePromptsProps []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleDelete = async (id: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("prompts").delete().eq("id", id).eq("user_id", user.id);
    await fetchPrompts();
  };

  return (
    <section className="mt-6 text-black">
      <h2 className="text-xl font-semibold mb-2">My Prompts</h2>

      {loading ? (
        <p className="text-sm text-gray-500">กำลังโหลด...</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="border rounded-xl p-3 flex flex-row items-center gap-4 bg-white shadow-sm hover:shadow-md transition-all"
            >
              {r.image_url && (
                <Image
                  src={r.image_url}
                  width={1000}
                  height={1000}
                  alt="Generated"
                  className="w-36 h-24 object-cover rounded-lg border"
                />
              )}

              <div className="flex-1">
                <div className="text-sm opacity-70">
                  {new Date(r.created_at).toLocaleString()}
                </div>
                <pre className="whitespace-pre-wrap break-words my-2">
                  {r.prompt}
                </pre>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1 rounded-lg border hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}

          {rows.length === 0 && !loading && (
            <li className="text-sm opacity-60">
              ยังไม่มี prompt - ลองพิมพ์ด้านบนแล้วกด &quot;สร้างห้อง&quot;
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
