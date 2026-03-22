import OpenAI from "openai";
import { portfolioContext } from "./portfolioContext.js";
import { projectLinks } from "./projectLinks.js";
import { buildContextBlock, retrieveRelevantChunks } from "./rag.js";

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getBookingContext() {
  const bookingUrl = process.env.GOOGLE_CALENDAR_BOOKING_URL?.trim();

  if (!bookingUrl) {
    return "";
  }

  return `Google Calendar booking link:\n- ${bookingUrl}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, visitorName, history } = req.body as {
      message?: string;
      visitorName?: string;
      history?: HistoryMessage[];
    };

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const recentHistory = Array.isArray(history)
      ? history
          .filter(
            (item): item is HistoryMessage =>
              (item?.role === "user" || item?.role === "assistant") &&
              typeof item?.content === "string" &&
              item.content.trim().length > 0,
          )
          .slice(-10)
      : [];

    const relevantChunks = await retrieveRelevantChunks(message);
    const retrievedContext = buildContextBlock(relevantChunks);
    const hasRetrievedContext = relevantChunks.length > 0;
    const bookingContext = getBookingContext();
    const effectiveContext = hasRetrievedContext
      ? `${retrievedContext}\n\nFallback portfolio context:\n${portfolioContext}${bookingContext ? `\n\n${bookingContext}` : ""}`
      : `${portfolioContext}${bookingContext ? `\n\n${bookingContext}` : ""}`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
    You are Kusal Dissanayake's personal portfolio assistant.

    Answer ONLY using the portfolio context and project links below.
    Do NOT make up facts.
    If the answer is not available, say so clearly.

    Portfolio context:
    ${effectiveContext}

    Project links:
    ${projectLinks
      .map((p) => `- ${p.name}: ${p.description} | GitHub: ${p.github}`)
      .join("\n")}

    Behavior rules:
    - Answer the user's specific question directly and do not include unrelated sections.
    - Do not add extra categories like skills, projects, or experience unless the user asked for them.
    - If the user asks to see projects, include the relevant GitHub links.
    - If the user asks for contact details, reaching out, scheduling, booking, appointments, or talking to Kusal, include the relevant contact details.
    - When a Google Calendar booking link is available and the user's intent is contact or scheduling related, suggest booking an appointment in the same answer.
    - Prefer the retrieved context when it is present because it reflects indexed site content.
    - If retrieved context is missing or incomplete, use the fallback portfolio context.
    - If the user asks about skills, experience, education, or achievements, answer from the available portfolio context.
    - Keep answers concise and professional.
    - Format list-like answers in a readable way using short headings and bullet points instead of one long paragraph.
    - Use plain text bullets with line breaks, not JSON.
    - Only say information is unavailable when it is missing from both the retrieved context and the fallback portfolio context.
    - Use the recent conversation history to resolve follow-up questions like "what about his backend skills?" or "how can I contact him?".
    - When history and the latest message conflict, prioritize the latest user message.
        `,
        },
        ...recentHistory.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        {
          role: "user",
          content:
            recentHistory.length > 0
              ? `Visitor: ${visitorName}\nLatest question: ${message}`
              : `Visitor: ${visitorName}\nQuestion: ${message}`,
        },
      ],
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Something went wrong while generating the reply.",
    });
  }
}
