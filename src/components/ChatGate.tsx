import { useState } from "react";

interface Props {
  onStart: (name: string) => void;
}

export default function ChatGate({ onStart }: Props) {
  const [name, setName] = useState("");
  const trimmedName = name.trim();

  const handleStart = () => {
    if (!trimmedName) return;
    onStart(trimmedName);
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 to-white p-5">
      <h2 className="mb-2 text-xl font-semibold text-slate-900">
        Hi! I'm Kusal's AI assistant 👋
      </h2>

      <p className="mb-5 text-sm leading-6 text-slate-600">
        I can answer questions about Kusal's experiences, projects, skills or
        Book a meeting.
      </p>

      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 w-full rounded-xl border border-sky-100 bg-white p-3 text-slate-900 outline-none transition-colors cursor-text focus:border-sky-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleStart();
          }
        }}
      />

      <button
        onClick={handleStart}
        disabled={!trimmedName}
        className="w-full rounded-xl bg-gradient-to-r from-slate-950 to-sky-700 px-4 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        Start Chat
      </button>
    </div>
  );
}
