type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendChatMessage(
  message: string,
  visitorName?: string,
  history: ChatHistoryMessage[] = [],
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      visitorName,
      history,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get chatbot response");
  }

  return response.json();
}
