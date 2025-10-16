"use client";
import { useState, useEffect } from "react";

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  selectedPrompt?: string;
}

export default function PromptForm({ onSubmit, isGenerating, selectedPrompt }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (selectedPrompt) {
      setPrompt(selectedPrompt);
    }
  }, [selectedPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-gray-500 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-black mb-3">
            อธิบายห้องที่คุณต้องการ:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="เช่น สร้างห้องนอนสไตล์มินิมอลสีขาว พร้อมเตียงไม้สีธรรมชาติ..."
            className="w-full h-32 p-4 rounded-xl bg-gray-50 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 bg-black text-white font-semibold py-4 px-6 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
      </form>
    </div>
  );
}
