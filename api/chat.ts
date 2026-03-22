import OpenAI from "openai";
import { projectLinks } from "./projectLinks.js";
import { buildContextBlock, retrieveRelevantChunks } from "./rag.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, visitorName } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const relevantChunks = await retrieveRelevantChunks(message);
    const portfolioContext = buildContextBlock(relevantChunks);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
    You are Kusal Dissanayake's personal portfolio assistant.

    Answer ONLY using the retrieved portfolio website context and project links below.
    Do NOT make up facts.
    If the answer is not available, say so clearly.

    Retrieved portfolio context:
    ${portfolioContext}

    Project links:
    ${projectLinks
      .map((p) => `- ${p.name}: ${p.description} | GitHub: ${p.github}`)
      .join("\n")}

    Behavior rules:
    - If the user asks to see projects, include the relevant GitHub links.
    - If the user asks about skills, experience, education, or achievements, answer from the retrieved context.
    - Keep answers concise and professional.
    - When the retrieved context is insufficient, explicitly say the information is not available in the indexed portfolio.
        `,
        },
        {
          role: "user",
          content: `Visitor: ${visitorName}\nQuestion: ${message}`,
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
