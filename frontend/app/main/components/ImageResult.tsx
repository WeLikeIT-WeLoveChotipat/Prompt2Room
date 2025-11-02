interface ImageResultProps {
  imageUrl: string | null;
  prompt: string;
}

export default function ImageResult({ imageUrl, prompt }: ImageResultProps) {
  if (!imageUrl) return null;

  return (
    <div className="mt-8 text-center">
      <img
        src={imageUrl}
        alt="Generated Room"
        className="mx-auto rounded-2xl shadow-lg w-full max-w-3xl"
      />
      <p className="text-gray-600 mt-2">ผลลัพธ์จาก Prompt: “{prompt}”</p>
    </div>
  );
}
