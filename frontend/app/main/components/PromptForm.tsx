"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface PromptFormProps {
  onSubmit: (prompt: string) => void | Promise<void>;
  isGenerating: boolean;
  selectedPrompt?: string;
  maxLength?: number;
}

// เก็บข้อความที่พิมอยู่
const DRAFT_KEY = "p2r.promptDraft";

export default function PromptForm({
  onSubmit,
  isGenerating,
  selectedPrompt,
  maxLength = 1000,
}: PromptFormProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (selectedPrompt && selectedPrompt.trim()) {
      setPrompt(selectedPrompt);
      return;
    }
    const saved = typeof window !== "undefined" ? localStorage.getItem(DRAFT_KEY) : null;
    if (saved) setPrompt(saved);
  }, [selectedPrompt]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthed(!!session);
    };
    checkAuth();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isGenerating) localStorage.setItem(DRAFT_KEY, prompt);
  }, [prompt, isGenerating]);

  const length = prompt.length;
  const overLimit = length > maxLength;
  const canSubmit = !isGenerating && !overLimit && !!prompt.trim();

  const counterClass = useMemo(() => {
    if (overLimit) return "text-red-600";
    if (length > maxLength * 0.9) return "text-amber-600";
    return "text-gray-500";
  }, [length, maxLength, overLimit]);

  const submitWithAuthCheck = async (value: string) => {
    if (isAuthed === null) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
    }

    if (isAuthed === false) {
      router.push("/login");
      return;
    }

    await onSubmit(value);
    setPrompt("");
    if (typeof window !== "undefined") localStorage.removeItem(DRAFT_KEY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await submitWithAuthCheck(prompt.trim());
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        await submitWithAuthCheck(prompt.trim());
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="เช่น สร้างห้องนอนสไตล์มินิมอลสีขาว พร้อมเตียงไม้สีธรรมชาติ..."
            className="w-full h-22 p-4 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-none resize-none"
            disabled={isGenerating}
            aria-invalid={overLimit}
            aria-describedby="prompt-hint prompt-count"
          />

          <div className="mt-2 flex items-center justify-between text-sm">
            <div className="flex gap-5 pl-5">
              <p id="prompt-count" className={counterClass}>
                {length}/{maxLength} ตัวอักษร
              </p>
              <p className="text-sm">
                {overLimit ? (
                  <span className="text-red-600">
                    ยาวเกินกำหนด กรุณาลดข้อความลงอีก {length - maxLength} ตัวอักษร
                  </span>
                ) : null}
              </p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={"py-4 px-10 rounded-xl font-semibold transition-all duration-300 shadow-md text-white bg-gradient-to-r from-orange-500 to-orange-500 hover:shadow-lg hover:from-orange-500 hover:to-orange-600 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังสร้าง...
                </div>
              ) : (
                "สร้างห้อง"
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}