"use client";
import { useState, useEffect } from "react";
import { getMessage } from "../utils/api";

export default function HomePage() {
  const [message, setMessage] = useState("Loading...");

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

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-3xl text-white">Prompt2Room</h1>
      <p className="text-lg text-white">{message}</p>
    </main>
  );
}
