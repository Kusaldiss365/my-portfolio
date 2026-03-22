import { indexSitePages } from "./rag";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await indexSitePages();
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Reindex API error:", error);
    return res.status(500).json({
      error: error?.message ?? "Failed to reindex portfolio pages.",
    });
  }
}
