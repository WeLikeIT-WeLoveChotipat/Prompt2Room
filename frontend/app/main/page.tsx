"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import Navigation from "../ui/Navigation";
import PromptForm from "./components/PromptForm";
import ExamplePrompts from "./components/ExamplePrompts";
import ImageResult from "./components/ImageResult";
import StoragePrompts from "./components/StoragePrompts";
import WhyChooseSection from "./components/WhyChooseSection";
import Footer from "@/app/ui/Footer";

import { getMessage } from "@/utils/api";
import {
  listStoragePrompts,
  deletePrompt,
  type PromptRow,
} from "@/utils/prompts";

type ProductItem = {
  category?: string;
  url?: string;
  item_name?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function MainPage() {
  const router = useRouter();

  const [statusMsg, setStatusMsg] = useState("Loading...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [rows, setRows] = useState<PromptRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const refreshPrompts = useCallback(
    async (uid: string) => {
      try {
        setErr(null);
        const data = await listStoragePrompts(uid);

        setRows(data);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "โหลดรายการ prompt ไม่ได้";
        setErr(msg);
      }
    },
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const uid = user?.id ?? null;
        setUserId(uid);

        try {
          const res = await getMessage();
          setStatusMsg(res.status);
        } catch {
          setStatusMsg("ต่อ API ยังไม่ได้ไอตูด");
        }

        if (uid) {
          await refreshPrompts(uid);
        } else {
          setRows([]);
        }
      } catch {
        setRows([]);
      }
    })();
  }, [refreshPrompts]);

  const handleSubmit = async (prompt: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return router.replace("/login");

    if (!userId) {
      setErr("ไม่พบผู้ใช้");
      return;
    }

    setIsGenerating(true);
    setErr(null);
    setImage(null);
    setProducts([]);
    setSelectedPrompt(prompt);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txt: prompt,
          user_id: userId
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "สร้างภาพไม่สำเร็จ");
      }

      const json = await res.json();

      const row = Array.isArray(json.data) ? json.data[0] : null;
      if (!row) {
        throw new Error("ไม่พบข้อมูลจากเซิร์ฟเวอร์");
      }

      if (row.image_url) {
        setImage(row.image_url as string);
      } else {
        setImage(null);
      }

      if (Array.isArray(row.categories)) {
        setProducts(row.categories as ProductItem[]);
      } else {
        setProducts([]);
      }

      await refreshPrompts(userId);
    } catch (e) {
      setErr(
        e instanceof Error ? e.message : "เกิดข้อผิดพลาดระหว่างสร้างภาพ"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPrompt = (p: string) => setSelectedPrompt(p);

  const handleDelete = async (id: number) => {
    if (!userId) return;
    try {
      setErr(null);
      await deletePrompt(id);
      await refreshPrompts(userId);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ลบไม่สำเร็จ");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-kanit">
      <p className="absolute top-0 left-0 text-lg text-red-700">
        status : {statusMsg}
      </p>

      <Navigation />

      {image ? (
        <div className="min-h-[calc(90vh-80px)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-200 via-orange-50 to-white">
          <div className="w-full max-w-6xl">
            <ImageResult
              imageUrl={image}
              prompt={selectedPrompt}
              products={products}
            />
          </div>
        </div>
      ) : (
        <div className="min-h-[calc(90vh-80px)] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-200 via-orange-50 to-white">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-black">
              ออกแบบห้องในฝันของคุณได้ทันที
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6">
              ด้วย <span className="text-orange-500">A</span>
              <span className="text-blue-500">I</span> ของเรา
            </h2>
            <p className="text-lg md:text-xl text-black mb-8">
              พิมพ์สไตล์ของคุณแล้วปล่อยให้ Prompt2Room ทำให้มันมีชีวิตชีวา
            </p>

            <PromptForm
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
              selectedPrompt={selectedPrompt}
            />

            {!isGenerating && (
              <ExamplePrompts
                onSelectPrompt={handleSelectPrompt}
                isGenerating={isGenerating}
              />
            )}

            {/* {err && <p className="mt-3 text-red-600">Error: {err}</p>} */}
          </div>
        </div>
      )}

      {userId && (
        <StoragePrompts rows={rows} onDelete={handleDelete} />
      )}

      <WhyChooseSection />
      <Footer />
    </main>
  );
}
