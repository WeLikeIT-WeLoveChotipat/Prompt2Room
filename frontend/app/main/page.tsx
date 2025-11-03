"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import ExamplePrompts from "./components/ExamplePrompts";
import ImageResult from "./components/ImageResult";
import StoragePrompts from "./components/StoragePrompts";

import { getMessage, filterMessage, generateResponse } from "@/utils/api";
import { insertPrompt, listStoragePrompts, deletePrompt, type PromptRow } from "@/utils/prompts";

type Piece = { mime_type?: string; b64: string };
type ProductItem = {
  category: string;
  url: string;
  item_name: string;
};

const toDataUrl = (p: Piece) => `data:${p.mime_type ?? "image/png"};base64,${p.b64}`;
const flattenTop = (arr: unknown[]) => arr.flatMap((x) => (Array.isArray(x) ? x : [x]));
const isPiece = (x: unknown): x is Piece => !!x && typeof x === "object" && x !== null && "b64" in x;

export default function MainPage() {
  const router = useRouter();

  const [statusMsg, setStatusMsg] = useState("Loading...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [rows, setRows] = useState<PromptRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const refreshPrompts = useCallback(async () => {
    try {
      setErr(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRows([]);
        return;
      }
      const data = await listStoragePrompts();
      setRows(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "โหลดรายการ prompt ไม่ได้";
      if (msg === "Not signed in") {
        setRows([]);
        return;
      }
      setErr(msg);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMessage();
        setStatusMsg(res.status);
      } catch {
        setStatusMsg("ต่อ API ยังไม่ได้ไอตูด");
      }
      await refreshPrompts();
    })();
  }, [refreshPrompts]);

  const handleSubmit = async (prompt: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.replace("/login");

    setIsGenerating(true);
    setErr(null);
    setImage(null);
    setProducts([]);
    setSelectedPrompt(prompt);

    try {
      const res = await filterMessage(prompt);
      if (res.label !== "INTERIOR_ROOM") {
        setErr(res.error?.message || "สร้างภาพไม่ได้");
        return;
      }

      const genRes = await generateResponse(res.normalized_prompt);
      const cleaned = (Array.isArray(genRes) ? genRes : [genRes]).filter(
        (item) => !(Array.isArray(item) && item.length === 0)
      );
      const items = flattenTop(cleaned).filter(Boolean);

      const firstImg = items.find(isPiece);
      if (!firstImg) {
        setErr("ไม่พบภาพที่สร้าง");
        return;
      }

      const productItems: ProductItem[] = [];
      for (const item of items) {
        if (isPiece(item)) continue;
        if (
          typeof item === "object" &&
          item !== null &&
          "category" in item &&
          "url" in item &&
          "item_name" in item
        ) {
          productItems.push(item as ProductItem);
        }
      }

      setProducts(productItems);

      const imageDataUrl = toDataUrl(firstImg);
      setImage(imageDataUrl);

      try {
        await insertPrompt(prompt, imageDataUrl);
        await refreshPrompts();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "บันทึก prompt ไม่ได้");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "เกิดข้อผิดพลาดระหว่างสร้างภาพ");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectPrompt = (p: string) => setSelectedPrompt(p);

  const handleDelete = async (id: number) => {
    try {
      setErr(null);
      await deletePrompt(id);
      await refreshPrompts();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ลบไม่สำเร็จ");
    }
  };

  // const gradient = {
  //   background: "linear-gradient(120deg, rgba(21,93,252,0.2) 0%, rgba(245,73,0,0.2) 100%)",
  // } as const;

  return (
    <main className="min-h-screen bg-white font-kanit">
      <p className="absolute top-0 left-0 text-lg text-red-700">status : {statusMsg}</p>

      <Header />

      {image ? (
        <div className="flex flex-col items-center justify-center p-4" >
          <div className="w-full max-w-7xl">
            <ImageResult imageUrl={image} prompt={selectedPrompt} products={products} />
            <StoragePrompts rows={rows} onDelete={handleDelete} />
          </div>
        </div>
      ) : (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4" >
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-semibold text-black">ออกแบบห้องในฝันของคุณได้ทันที</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6">
              ด้วย <span className="text-orange-500">A</span><span className="text-blue-500">I</span> ของเรา
            </h2>
            <p className="text-lg md:text-xl text-black mb-8">
              พิมพ์สไตล์ของคุณแล้วปล่อยให้ Prompt2Room ทำให้มันมีชีวิตชีวา
            </p>

            <PromptForm onSubmit={handleSubmit} isGenerating={isGenerating} selectedPrompt={selectedPrompt} />

            {!isGenerating && <ExamplePrompts onSelectPrompt={handleSelectPrompt} isGenerating={isGenerating} />}

            {err && <p className="mt-3 text-red-600">Error: {err}</p>}
          </div>
        </div>
      )}

      {!image && (
        <div className="flex flex-col items-center justify-center p-4 bg-white">
          <div className="w-full max-w-7xl">
            <StoragePrompts rows={rows} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </main>
  );
}
