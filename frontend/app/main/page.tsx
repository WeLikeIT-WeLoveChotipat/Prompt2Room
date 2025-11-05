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
import Footer from "@/app/ui/footer";

import { filterMessage, generateResponse } from "@/utils/api";
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

type ApiStatus = "loading" | "ok" | "error";

export default function MainPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [rows, setRows] = useState<PromptRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [apiMessage, setApiMessage] = useState("Loading...");

  const refreshPrompts = useCallback(
    async (uid: string) => {
      try {
        setErr(null);
        setApiStatus("loading");
        setApiMessage("กำลังดึงข้อมูล");
        const data = await listStoragePrompts(uid);
        setRows(data);
        setApiStatus("ok")
        setApiMessage("ปกติแลัวมั่ง")
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "ดึงข้อมูลไม่ได้"
        setErr(msg)
        setApiStatus("error")
        setApiMessage(msg)
      }
    },
    []
  );

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      await refreshPrompts(user.id);
    })();
  }, [router, refreshPrompts]);

  const handleSubmit = async (prompt: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return router.replace("/login")

    if (!userId) {
      const msg = "ไม่พบผู้ใช้"
      setErr(msg)
      setApiStatus("error")
      setApiMessage(msg)
      return;
    }

    setIsGenerating(true);
    setErr(null);
    setImage(null);
    setProducts([])
    setSelectedPrompt(prompt)
    setApiStatus("loading")
    setApiMessage("กำลังสร้างภาพ...")

    try {
      const res = await filterMessage(prompt);

      if (res.label !== "INTERIOR_ROOM") {
        const msg =
          res?.error?.message || "Promtนี้ยังไม่รองรับ (ไม่ใช่ห้องภายใน)"
        setErr(msg)
        setApiStatus("error")
        setApiMessage(msg)
        setIsGenerating(false)
        return
      }

      const genRes = await generateResponse(
        prompt,
        res.normalized_prompt,
        userId
      );

      if (genRes.status !== "ok") {
        const msg = genRes?.error?.message ?? "สร้างภาพไม่สำเร็จ"
        throw new Error(msg);
      }

      const json = await genRes
      const row = Array.isArray(json.data) ? json.data[0] : null

      if (!row) {
        throw new Error("ไม่พบข้อมูลจากเซิร์ฟเวอร์")
      }

      if (row.image_url) {
        setImage(row.image_url as string)
      } else {
        setImage(null)
      }

      if (Array.isArray(row.categories)) {
        setProducts(row.categories as ProductItem[])
      } else {
        setProducts([])
      }

      setApiStatus("ok")
      setApiMessage("สร้างภาพสำเร็จ")
      await refreshPrompts(userId)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "เกิดข้อผิดพลาดระหว่างสร้างภาพ"
      setErr(msg)
      setApiStatus("error")
      setApiMessage(msg)
    } finally {
      setIsGenerating(false)
    }
  };

  const handleSelectPrompt = (p: string) => setSelectedPrompt(p)

  const handleDelete = async (id: number) => {
    if (!userId) return;
    try {
      setErr(null);
      setApiStatus("loading")
      setApiMessage("กำลังลบ prompt...")
      await deletePrompt(id)
      await refreshPrompts(userId)
      setApiStatus("ok")
      setApiMessage("ลบแล้ว")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "ลบไม่สำเร็จ"
      setErr(msg)
      setApiStatus("error")
      setApiMessage(msg)
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 font-kanit">
      <Navigation apiStatus={apiStatus} apiMessage={apiMessage} />

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
          </div>
        </div>
      )}

      <StoragePrompts rows={rows} onDelete={handleDelete} />

      <WhyChooseSection />
      <Footer />
    </main>
  );
}

