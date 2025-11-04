"use client";
type ApiStatus = "loading" | "ok" | "error";

type StatusProps = {
  status: ApiStatus
  message?: string
  className?: string
}

export default function StatusBadge({
  status,
  message,
  className = "",
}: StatusProps) {
  const colorClass =
    status === "ok"
      ? "bg-green-600 text-white"
      : status === "loading"
      ? "bg-yellow-400 text-black"
      : "bg-red-500 text-white";

  const text =
    status === "ok"
      ? "Server: Connected"
      : status === "loading"
      ? "Server: Connecting..."
      : "Server: Error";

  return (
    <div
      className={`font-kanit flex items-center gap-2 px-3 py-1.5 rounded-full text-sm shadow-sm ${colorClass} ${className}`}
      title={message}
    >
      <span className="w-2 h-2 rounded-full bg-white/80" />
      <span>{message ? message : text}</span>
    </div>
  );
}
