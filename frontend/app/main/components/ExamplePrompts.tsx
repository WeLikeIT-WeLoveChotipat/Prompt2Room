interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

export default function ExamplePrompts({ onSelectPrompt, isGenerating }: ExamplePromptsProps) {
  const examples = [
    { label: "ห้องนั่งเล่นเรียบง่าย", prompt: "ห้องนั่งเล่นโทนไม้สว่าง เรียบง่าย สบายตา นั่งชิลได้ทั้งวัน" },
    { label: "ห้องครัวโทนดำ", prompt: "ห้องครัวโทนดำเท่ ๆ มีไอส์แลนด์กลางห้อง แสงอุ่นน่าเข้าครัว" },
    { label: "ห้องน้ำหินอ่อนขาว", prompt: "ห้องน้ำหินอ่อนขาว ก๊อกสีดำ ดูสะอาดและหรูนิด ๆ" },
    { label: "ห้องเด็กโทนสดใส", prompt: "ห้องเด็กโทนสดใส ตู้เก็บของเยอะ เก็บง่ายไม่รก" },
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
