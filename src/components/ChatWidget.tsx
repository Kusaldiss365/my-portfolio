import { useState } from "react";
import ChatGate from "./ChatGate";
import ChatWindow, { type ChatMessage } from "./ChatWindow";
import { supabase } from "../lib/supabase";
import { sendChatMessage } from "@/lib/chatApi";
import { X } from "lucide-react";

const welcomeMessage = (name: string): ChatMessage => ({
  role: "assistant",
  content: `Nice to meet you, ${name}. Ask me anything about Kusal.`,
});

async function saveMessage(sessionId: string, message: ChatMessage) {
  return supabase.from("chat_messages").insert({
    session_id: sessionId,
    role: message.role,
    content: message.content,
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleStart = async (name: string) => {
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        visitor_name: name,
      })
      .select()
      .single();

    if (error) {
      console.error("Session error:", error.message);
      return;
    }

    setVisitorName(name);
    setSessionId(data.id);

    const assistantWelcome = welcomeMessage(name);

    setMessages([assistantWelcome]);

    await saveMessage(data.id, assistantWelcome);
  };

  const handleSend = async (message: string) => {
    if (!sessionId || !visitorName) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const conversationHistory = [...messages, userMessage].slice(-10);

    const { error: userError } = await saveMessage(sessionId, userMessage);

    if (userError) {
      console.error("User message save error:", userError.message);
    }

    try {
      const data = await sendChatMessage(
        message,
        visitorName,
        conversationHistory,
      );

      const botReply: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, botReply]);

      const { error: botError } = await saveMessage(sessionId, botReply);

      if (botError) {
        console.error("Bot message save error:", botError.message);
      }
    } catch (error) {
      console.error("Chat API call failed:", error);

      const fallbackReply: ChatMessage = {
        role: "assistant",
        content: "Sorry, something went wrong while generating the response.",
      };

      setMessages((prev) => [...prev, fallbackReply]);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div
        className={`pointer-events-auto fixed bottom-6 right-6 origin-bottom-right overflow-hidden border border-sky-200/20 bg-white backdrop-blur transition-all duration-300 ease-out ${
          open
            ? "w-[24rem] max-w-[calc(100vw-1.5rem)] rounded-[1.5rem] shadow-[0_30px_90px_rgba(15,23,42,0.35)] opacity-100 scale-100"
            : "w-[15.5rem] rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-slate-900 text-white shadow-[0_20px_60px_rgba(14,165,233,0.35)] opacity-100 scale-100 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(14,165,233,0.45)]"
        }`}
      >
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left text-white"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-200 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">
                Chat with Kusal's AI
              </span>
              <span className="block text-xs text-blue-100/90">
                Projects, skills or appointments
              </span>
            </span>
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between border-b border-sky-100 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 px-5 py-4 text-white">
              <div>
                <p className="text-base font-semibold">Kusal's AI Assistant</p>
                <p className="text-xs text-sky-100/80">
                  Grounded in portfolio content
                </p>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-300 cursor-pointer transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {!visitorName ? (
              <ChatGate onStart={handleStart} />
            ) : (
              <ChatWindow
                visitorName={visitorName}
                messages={messages}
                onSend={handleSend}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
