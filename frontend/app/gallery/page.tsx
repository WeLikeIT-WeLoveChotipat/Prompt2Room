"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "../ui/Navigation";
import Footer from "../ui/footer";

type PromptItem = {
  id: number;
  prompt: string;
  image_url: string | null;
  created_at: string;
};

type ApiStatus = "loading" | "ok" | "error";

const PAGE_SIZE = 12;

export default function GalleryPage() {
  const [items, setItems] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [apiMessage, setApiMessage] = useState("กำลังโหลด...");

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id)
        await fetchGallery(user.id, 0)
        setApiStatus("ok")
        setApiMessage("ปกติแหละ")
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "เกิดข้อผิดพลาดขณะโหลดข้อมูล";
        setErr(msg);
        setApiStatus("error");
        setApiMessage(msg);
      }
    })();
  }, [router]);

  const fetchGallery = async (uid: string, pageIndex: number) => {
    try {
      setLoading(true)
      setApiStatus("loading")
      setApiMessage("กำลังดึงข้อมูล")

      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count, error } = await supabase
        .from("prompts")
        .select("id, prompt, image_url, created_at", { count: "exact" })
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (pageIndex === 0) {
          setItems(data as PromptItem[]);
        } else {
          setItems((prev) => [...prev, ...(data as PromptItem[])]);
        }

        const total = count ?? 0;
        const loaded = to + 1;
        setHasMore(loaded < total);
      }

      setPage(pageIndex)
      setApiStatus("ok")
      setApiMessage("โหลดสำเร็จ")
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "ไม่สามารถโหลดข้อมูลได้"
      setErr(msg)
      setApiStatus("error")
      setApiMessage(msg)
    } finally {
      setLoading(false)
    }
  };

  const handleLoadMore = async () => {
    if (!userId) return;
    await fetchGallery(userId, page + 1);
  };

  const handleDelete = async (id: number) => {
    if (!userId) return;

    try {
      setApiStatus("loading");
      setApiMessage("กำลังลบ prompt...");
      await supabase.from("prompts").delete().eq("id", id).eq("user_id", userId);
      setItems((prev) => prev.filter((p) => p.id !== id));
      setApiStatus("ok")
      setApiMessage("ลบสำเร็จ")
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "ลบไม่สำเร็จ"
      setErr(msg)
      setApiStatus("error")
      setApiMessage(msg)
    }
  };

  return (
    <section className="min-h-[100vh] flex flex-col items-center justify-between bg-gradient-to-t from-blue-200 via-blue-100 to-gray-100 ">
      <Navigation apiStatus={apiStatus} apiMessage={apiMessage} />

      <div className="pt-20 px-[15%] sm:px-[4%] w-full max-w-[1480px] mx-auto pb-16 font-kanit">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-black mb-3">
              Gallery ของฉัน
            </h2>
            <p className="text-xl text-gray-600">
              รวมรูปห้องทั้งหมดที่เคยสร้างไว้จาก Prompt2Room
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-full h-54 bg-gray-200" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-2/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400">ยังไม่มีภาพที่สร้าง</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {items.map((r) => (
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

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-orange-500 to-orange-500 hover:shadow-lg hover:from-orange-500 hover:to-orange-600 hover:scale-105 transition-all duration-300"
                >
                  ดูเพิ่มเติม
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </section>
  );
}

