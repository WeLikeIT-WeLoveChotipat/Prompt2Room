interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export default function ExamplePrompts({ onSelectPrompt, isGenerating }: ExamplePromptsProps) {
  const examples = [
    { label: "ห้องมินิมอล", prompt: "ห้องนอนสไตล์มินิมอลสีขาว พร้อมเตียงไม้สีธรรมชาติ" },
    { label: "ครัวสไตล์สแกนดิเนเวียน", prompt: "ห้องครัวสไตล์สแกนดิเนเวียน พร้อมเกาะครัวสีขาว" },
    { label: "ห้องนั่งเล่นสไตล์โมเดิร์น", prompt: "ห้องนั่งเล่นสไตล์โมเดิร์นสีเทา พร้อมโซฟาสีน้ำเงิน" },
  ];

  return (
    <div className="flex gap-3 justify-center flex-wrap mt-6">
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => onSelectPrompt(example.prompt)}
          disabled={isGenerating}
          className="bg-white text-black hover:text-blue-500 px-6 py-2 rounded-4xl hover:bg-gray-50 transition-all duration-200 border border-gray-300 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {example.label}
        </button>
      ))}
    </div>
  );
}
