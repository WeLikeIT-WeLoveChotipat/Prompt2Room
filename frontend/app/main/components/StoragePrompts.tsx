import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

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
    const { data, count, error } = await supabase
      .from("prompts")
      .select("id, prompt, image_url, created_at", { count: "exact" })
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(4);

    if (!error && data) {
      setRows(data as StoragePromptsRow[])
      setHasMore((count ?? 0) > 4)
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;
    await supabase.from("prompts").delete().eq("id", id).eq("user_id", userId);
    setRows((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="px-[15%] sm:px-[2%] w-full max-w-[1480px] mx-auto pt-5">
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-black mb-3">
            แรงบันดาลใจล่าสุดของฉัน
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-gray-600">
            ทุกแรงบันดาลใจเริ่มจากคำสั่งเล็ก ๆ ที่กลายเป็นผลงานชิ้นใหม่ของฉัน
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="w-full h-54 object-cover bg-gray-200" />
              <div className="p-5 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-2/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          ยังไม่มี prompt — ลองพิมพ์ด้านบนแล้วกด “สร้างห้อง”
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {rows.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:rotate-[-0.8deg] transition-all border border-gray-100 duration-300"
            >
              {r.image_url ? (
                <Image
                  src={r.image_url}
                  width={600}
                  height={400}
                  alt="Generated Room"
                  className="w-full h-54 object-cover"
                />
              ) : (
                <div className="w-full h-54 bg-gray-100" />
              )}
              <div className="p-5">
                <p className="text-xl font-semibold text-gray-800 line-clamp-2">
                  {r.prompt}
                </p>
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
                    className="text-sm rounded-2xl px-2 py-0.5 hover:bg-gray-200 text-red-500 hover:text-red-600 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push("/gallery")}
            className="px-6 py-2 rounded-full bg-orange-500 text-white bg-gradient-to-r duration-300 from-orange-500 to-orange-500 hover:shadow-lg hover:from-orange-500 hover:to-orange-600 hover:scale-105"
          >
            ดูเพิ่มเติม
          </button>
        </div>
      )}

    </section>
  );
}
