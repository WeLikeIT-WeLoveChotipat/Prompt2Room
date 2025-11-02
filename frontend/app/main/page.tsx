"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import ExamplePrompts from "./components/ExamplePrompts";
import ImageResult from "./components/ImageResult";
import StoragePrompts from "./components/StoragePrompts";

import { getMessage, filterMessage, generateResponse } from "@/utils/api";
import { insertPrompt, listStoragePrompts, deletePrompt, type PromptRow } from "@/utils/prompts";

export default function MainPage() {
  const router = useRouter();
  const [statusMsg, setStatusMsg] = useState("Loading...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [rows, setRows] = useState<PromptRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      try {
        const res = await getMessage();
        setStatusMsg(res.status);
      } catch {
        setStatusMsg("ต่อ API ยังไม่ได้ไอตูด");
      }

      await refreshPrompts();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, sess) => {
        if (!sess) router.replace("/login");
      });
      return () => subscription.unsubscribe();
    })();

    return () => { mounted = false; };
  }, [router]);

  async function refreshPrompts() {
    try {
      setErr(null);
      const data = await listStoragePrompts();
      setRows(data);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "โหลดร list prompt ไม่ได้");
    }
  }

  const handleSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setImage(null);
    setSelectedPrompt(prompt);

    const testImage = "https://static.thairath.co.th/media/dFQROr7oWzulq5FZYji3eXybX5HOwLzNUcsnKzGgrOwjz5InwssEzNEvi1MzMqW5sFh.jpg";
    setTimeout(async () => {
      setIsGenerating(false);
      setImage(testImage);
      // console.log(`Prompt: "${prompt}"`);
      // console.log(`Image: "${testImage}"`);
      try {
          console.time("generate");
        const res = await filterMessage(prompt);
        if (res.label == "INTERIOR_ROOM") {
          console.log(`status: filtered`);
          const genRes  = await generateResponse(res.normalized_prompt);
          const cleaned = genRes.filter(item => !(Array.isArray(item) && item.length === 0));
          const items = flattenTop(cleaned).filter(Boolean);
          const firstImg: Piece | undefined = items.find(
            (x: any) => x && typeof x === 'object' && 'b64' in x
          );

          if (firstImg) {
            setImage(toDataUrl(firstImg));
          for (let i = 1 ; i < items.length - 1; i++) {
            console.log(items[i]);
          }
          console.timeEnd("generate");
        }
        else {
          console.log(res.error.message);
          console.log(res.error.reason);
        }
      }
    }
      catch (error) {
        console.error(error);
      }

      try {
        await insertPrompt(prompt, testImage);
        await refreshPrompts();
      } catch (error) {
        setErr(error instanceof Error ? error.message : "บันทึก prompt ไม้ได้");
      }
    }, 2000);
  };

  const handleSelectPrompt = (p: string) => setSelectedPrompt(p);

  async function handleDelete(id: number) {
    try {
      setErr(null);
      await deletePrompt(id);
      await refreshPrompts();
    } catch (error) {
      setErr(error instanceof Error ? error.message : "ลบไม่สำเร็จ");
    }
  }
  type Piece = { mime_type?: string; b64: string };

  const toDataUrl = (p: Piece) =>
  `data:${p.mime_type ?? 'image/png'};base64,${p.b64}`;

  const flattenTop = (arr: any[]) =>
    arr.flatMap(x => (Array.isArray(x) ? x : [x]));

  return (
    <main className="min-h-screen bg-white">
      <p className="absolute top-0 left-0 text-lg text-red-700">status : {statusMsg}</p>

      <Header />

      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          {!isGenerating && !image && (
            <ExamplePrompts onSelectPrompt={handleSelectPrompt} isGenerating={isGenerating} />
          )}

          <ImageResult imageUrl={image} prompt={selectedPrompt} />

          {!image && (
            <PromptForm
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
              selectedPrompt={selectedPrompt}
            />
          )}

          {err && <p className="mt-3 text-red-600">Error: {err}</p>}

          <StoragePrompts rows={rows} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
