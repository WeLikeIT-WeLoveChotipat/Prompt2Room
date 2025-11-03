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
      setRows(data as StoragePromptsProps[]);
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
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        My Generated Rooms
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">กำลังโหลด...</p>
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
              {r.image_url && (
                <Image
                  src={r.image_url}
                  width={600}
                  height={400}
                  alt="Generated Room"
                  className="w-full h-48 object-cover"
                />
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
                    className="text-sm rounded-2xl px-2 py-0.5 hover:bg-gray-300 text-red-500 hover:text-red-600 transition-colors"
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
