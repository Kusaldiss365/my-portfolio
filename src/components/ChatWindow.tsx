import { useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  visitorName: string;
  messages: ChatMessage[];
  onSend: (message: string) => Promise<void>;
}

export default function ChatWindow({ visitorName, messages, onSend }: Props) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const trimmedInput = input.trim();

  const handleSend = async () => {
    if (!trimmedInput || sending) return;

    setSending(true);
    setInput("");

    try {
      await onSend(trimmedInput);
    } catch {
      setInput(trimmedInput);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-sky-50/60 p-5">
      <p className="mb-3 text-sm text-slate-600">
        Chat started as <strong>{visitorName}</strong>
      </p>

      <div className="mb-4 h-72 space-y-2 overflow-y-auto rounded-2xl border border-sky-100 bg-white/80 p-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">Ask something about Kusal...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "ml-auto bg-gradient-to-r from-slate-950 to-sky-800 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}

        {sending && (
          <div className="max-w-[85%] rounded-2xl bg-slate-100 p-3 text-sm text-slate-900 shadow-sm">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500"></span>
            </span>
          </div>
        )}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSend();
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 rounded-xl border border-sky-100 bg-white p-3 text-slate-900 outline-none transition-colors cursor-text focus:border-sky-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-slate-950 to-sky-700 px-5 py-3 text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          disabled={sending || !trimmedInput}
        >
          Send
        </button>
      </form>
    </div>
  );
}
