import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type StoragePromptsProps = {
  id: number;
  prompt: string;
  image_url: string | null;
  created_at: string;
};

export default function StoragePrompts() {
  const [rows, setRows] = useState<StoragePromptsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        await fetchPrompts(user.id)
      } else {
        setRows([])
        setLoading(false)
      }
    })()
  }, [])

  const fetchPrompts = async (uid: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prompts")
      .select("id, prompt, image_url, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(4)

    if (!error && data) {
      setRows(data as  StoragePromptsProps[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;
    await supabase.from("prompts").delete().eq("id", id).eq("user_id", userId);
    setRows((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        My Generated Rooms
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-6 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-gray-400 text-sm">
          ยังไม่มี prompt — ลองพิมพ์ด้านบนแล้วกด “สร้างห้อง”
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              {r.image_url ? (
                <Image
                  src={r.image_url}
                  width={600}
                  height={400}
                  alt="Generated Room"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {r.prompt}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(r.created_at).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-white text-blue-500 px-3 py-1 rounded-full border border-blue-500">
                    Generated
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-sm rounded-2xl px-2 py-0.5 hover:bg-gray-100 text-red-500 hover:text-red-600 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
