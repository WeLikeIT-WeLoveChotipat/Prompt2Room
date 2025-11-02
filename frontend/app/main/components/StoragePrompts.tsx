import { type PromptRow } from "@/utils/prompts";

type StoragePromptsProps = {
  rows: PromptRow[];
  onDelete: (id: number) => void;
};

export default function StoragePrompts({ rows, onDelete }: StoragePromptsProps) {
  return (
    <section className="mt-6 text-black">
      <h2 className="text-xl font-semibold mb-2">My Prompts</h2>
      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="border rounded-xl p-3 flex flex-row items-center gap-4">
            {r.image && (
              <img
                src={r.image}
                alt="Generated"
                className="w-36 h-24 object-cover rounded-lg border"
              />
            )}

            <div className="flex-1">
              <div className="text-sm opacity-70">{new Date(r.created_at).toLocaleString()}</div>
              <pre className="whitespace-pre-wrap break-words my-2">{r.prompt}</pre>
              <div className="flex gap-2">
                <button
                  onClick={() => onDelete(r.id)}
                  className="px-3 py-1 rounded-lg border hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="text-sm opacity-60">
            ยังไม่มี prompt - ลองพิมพ์ด้านบนแล้วกด &quot;สร้างห้อง&quot;
          </li>
        )}
      </ul>
    </section>
  );
}


