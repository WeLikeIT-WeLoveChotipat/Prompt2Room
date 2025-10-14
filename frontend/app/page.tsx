"use client";
import { useState, useEffect } from "react";
import { getMessage } from "../utils/api";
import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import ExamplePrompts from "./components/ExamplePrompts";
import ImageResult from "./components/ImageResult";

export default function HomePage() {
  const [message, setMessage] = useState("Loading...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await getMessage();
        setMessage(response.message);
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessage("ต่อ API ยังไม่ได้ไอตูด");
      }
    };
    fetchMessage();
  }, []);

  const handleSubmit = async (prompt: string) => {
    setIsGenerating(true);
    setImageUrl(null);

    setSelectedPrompt(prompt);

    setTimeout(() => {
      setIsGenerating(false);
      setImageUrl(
        "https://static.thairath.co.th/media/dFQROr7oWzulq5FZYji3eXybX5HOwLzNUcsnKzGgrOwjz5InwssEzNEvi1MzMqW5sFh.jpg"
      );
      console.log(`Prompt: "${prompt}"`);
    }, 2000);
  };

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <p className="absolute top-0 left-0 text-lg text-red-700">status : {message}</p>
      <div className="w-full max-w-7xl">
        <Header />

        {!isGenerating && !imageUrl && (
          <ExamplePrompts
            onSelectPrompt={handleSelectPrompt}
            isGenerating={isGenerating}
          />
        )}

        <ImageResult
          imageUrl={imageUrl}
          prompt={selectedPrompt}
        />

        {!imageUrl && (
          <PromptForm
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            selectedPrompt={selectedPrompt}
          />
        )}

      </div>
    </main>
  );
}

