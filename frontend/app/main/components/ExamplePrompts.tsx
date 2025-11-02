interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export default function ExamplePrompts({ onSelectPrompt, isGenerating }: ExamplePromptsProps) {
  const examples = [
    "ห้องนอนสไตล์มินิมอลสีขาว พร้อมเตียงไม้สีธรรมชาติ",
    "ห้องนั่งเล่นสไตล์โมเดิร์นสีเทา พร้อมโซฟาสีน้ำเงิน",
    "ห้องครัวสไตล์สแกนดิเนเวียน พร้อมเกาะครัวสีขาว"
  ];

  return (
    <div className="mb-[5%]">
      <h3 className="text-lg font-medium text-black mb-4">ตัวอย่าง Prompt:</h3>
      <div className="grid gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(example)}
            disabled={isGenerating}
            className="text-left p-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 border-2 border-gray-200 hover:border-gray-500"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
