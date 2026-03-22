import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { portfolioContext } from "./portfolioContext";
import { projectLinks } from "./projectLinks";

const DEFAULT_SITE_URL = "https://www.kusaldissanayake.com";
const EMBEDDING_MODEL = "text-embedding-3-small";
const MATCH_COUNT = 6;
const MAX_CHUNK_CHARS = 1200;
const CHUNK_OVERLAP_CHARS = 200;
const MAX_PAGES = 25;

type PageRecord = {
  id: string;
  url: string;
  content_hash: string | null;
};

type CrawledPage = {
  url: string;
  title: string;
  text: string;
  hash: string;
};

type RetrievedChunk = {
  content: string;
  url: string | null;
  title: string | null;
  similarity?: number | null;
};

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getOpenAIClient() {
  return new OpenAI({
    apiKey: requireEnv("OPENAI_API_KEY"),
  });
}

export function getSupabaseAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.",
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSiteUrl() {
  return process.env.SITE_URL ?? DEFAULT_SITE_URL;
}

function normalizeUrl(rawUrl: string, origin: string) {
  const url = new URL(rawUrl, origin);

  if (url.origin !== origin) {
    return null;
  }

  if (
    url.pathname.startsWith("/api/") ||
    /\.(png|jpe?g|gif|svg|webp|ico|pdf|xml|txt|json|woff2?)$/i.test(url.pathname)
  ) {
    return null;
  }

  url.hash = "";
  url.search = "";

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'");
}

function stripHtml(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
      .replace(/<\/(p|div|section|article|li|h1|h2|h3|h4|h5|h6|tr)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripHtml(match[1]) : "";
}

function extractLinks(html: string, origin: string) {
  const matches = [...html.matchAll(/<a\s[^>]*href=["']([^"']+)["']/gi)];
  const urls = new Set<string>();

  for (const match of matches) {
    const normalized = normalizeUrl(match[1], origin);
    if (normalized) {
      urls.add(normalized);
    }
  }

  return [...urls];
}

function hashContent(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function splitIntoChunks(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const targetEnd = Math.min(start + MAX_CHUNK_CHARS, normalized.length);
    let end = targetEnd;

    if (targetEnd < normalized.length) {
      const breakIndex = normalized.lastIndexOf(" ", targetEnd);
      if (breakIndex > start + Math.floor(MAX_CHUNK_CHARS * 0.6)) {
        end = breakIndex;
      }
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= normalized.length) {
      break;
    }

    start = Math.max(end - CHUNK_OVERLAP_CHARS, start + 1);
  }

  return chunks;
}

async function fetchPage(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "portfolio-rag-indexer/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return null;
  }

  const html = await response.text();
  const text = stripHtml(html);

  if (!text) {
    return null;
  }

  return {
    url,
    title: extractTitle(html) || new URL(url).pathname || "Home",
    text,
    links: extractLinks(html, new URL(url).origin),
  };
}

async function getSeedUrls(siteUrl: string) {
  const origin = new URL(siteUrl).origin;
  const normalizedRoot = normalizeUrl(siteUrl, origin) ?? siteUrl;
  const urls = new Set<string>([normalizedRoot]);

  try {
    const sitemapResponse = await fetch(new URL("/sitemap.xml", origin), {
      headers: {
        "User-Agent": "portfolio-rag-indexer/1.0",
      },
    });

    if (sitemapResponse.ok) {
      const sitemapXml = await sitemapResponse.text();
      const matches = [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)];

      for (const match of matches) {
        const normalized = normalizeUrl(match[1].trim(), origin);
        if (normalized) {
          urls.add(normalized);
        }
      }
    }
  } catch (error) {
    console.warn("Sitemap fetch failed, falling back to in-page crawl.", error);
  }

  return [...urls];
}

export async function crawlSite(siteUrl = getSiteUrl()) {
  const origin = new URL(siteUrl).origin;
  const queue = await getSeedUrls(siteUrl);
  const visited = new Set<string>();
  const pages: CrawledPage[] = [];

  while (queue.length > 0 && pages.length < MAX_PAGES) {
    const currentUrl = queue.shift();
    if (!currentUrl || visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    try {
      const page = await fetchPage(currentUrl);

      if (!page) {
        continue;
      }

      pages.push({
        url: page.url,
        title: page.title,
        text: page.text,
        hash: hashContent(page.text),
      });

      for (const link of page.links) {
        if (!visited.has(link) && link.startsWith(origin)) {
          queue.push(link);
        }
      }
    } catch (error) {
      console.warn(`Failed to crawl ${currentUrl}`, error);
    }
  }

  return pages;
}

function getSourceBackedPages(siteUrl: string): CrawledPage[] {
  const baseUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const sourcePages = [
    {
      url: `${baseUrl}/__index-source/portfolio`,
      title: "Portfolio Source Context",
      text: portfolioContext.trim(),
    },
    {
      url: `${baseUrl}/__index-source/projects`,
      title: "Portfolio Project Links",
      text: projectLinks
        .map(
          (project) =>
            `${project.name}\nType: ${project.type}\nDescription: ${project.description}\nGitHub: ${project.github}`,
        )
        .join("\n\n"),
    },
  ];

  return sourcePages.map((page) => ({
    ...page,
    hash: hashContent(page.text),
  }));
}

async function embedTexts(client: OpenAI, inputs: string[]) {
  if (inputs.length === 0) {
    return [];
  }

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });

  return response.data.map((item) => item.embedding);
}

function toPgVectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

function parseStoredVector(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(Number);
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized.startsWith("[") || !normalized.endsWith("]")) {
    return null;
  }

  return normalized
    .slice(1, -1)
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part));
}

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length === 0 || a.length !== b.length) {
    return -1;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  if (normA === 0 || normB === 0) {
    return -1;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function indexSitePages(siteUrl = getSiteUrl()) {
  const supabase = getSupabaseAdminClient();
  const openai = getOpenAIClient();
  const crawledPages = await crawlSite(siteUrl);
  const sourcePages = getSourceBackedPages(siteUrl);
  const allPages = [...crawledPages, ...sourcePages];

  let indexedPages = 0;
  let skippedPages = 0;
  let chunkCount = 0;

  for (const page of allPages) {
    const { data: existingPageData, error: existingPageError } = await supabase
      .from("site_pages")
      .select("id, url, content_hash")
      .eq("url", page.url)
      .maybeSingle();

    const existingPage = existingPageData as PageRecord | null;

    if (existingPageError) {
      throw existingPageError;
    }

    if (existingPage?.content_hash === page.hash) {
      skippedPages += 1;

      const { error: touchError } = await supabase
        .from("site_pages")
        .update({
          title: page.title,
          content: page.text,
          last_crawled_at: new Date().toISOString(),
        })
        .eq("id", existingPage.id);

      if (touchError) {
        throw touchError;
      }

      continue;
    }

    const { data: savedPageData, error: upsertError } = await supabase
      .from("site_pages")
      .upsert(
        {
          id: existingPage?.id,
          url: page.url,
          title: page.title,
          content: page.text,
          content_hash: page.hash,
          last_crawled_at: new Date().toISOString(),
          last_indexed_at: new Date().toISOString(),
        },
        {
          onConflict: "url",
        },
      )
      .select("id, url, content_hash")
      .single();

    const savedPage = savedPageData as PageRecord;

    if (upsertError) {
      throw upsertError;
    }

    const { error: deleteError } = await supabase
      .from("site_chunks")
      .delete()
      .eq("page_id", savedPage.id);

    if (deleteError) {
      throw deleteError;
    }

    const chunks = splitIntoChunks(page.text);
    const embeddings = await embedTexts(openai, chunks);
    const rows = chunks.map((content, chunkIndex) => ({
      page_id: savedPage.id,
      url: page.url,
      title: page.title,
      chunk_index: chunkIndex,
      content,
      content_hash: hashContent(`${page.hash}:${chunkIndex}:${content}`),
      embedding: toPgVectorLiteral(embeddings[chunkIndex]),
    }));

    if (rows.length > 0) {
      const { error: insertChunksError } = await supabase
        .from("site_chunks")
        .insert(rows);

      if (insertChunksError) {
        throw insertChunksError;
      }
    }

    indexedPages += 1;
    chunkCount += rows.length;
  }

  return {
    siteUrl,
    crawledPages: crawledPages.length,
    sourcePages: sourcePages.length,
    totalPagesConsidered: allPages.length,
    indexedPages,
    skippedPages,
    chunkCount,
  };
}

async function retrieveWithRpc(queryEmbedding: number[]) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.rpc("match_site_chunks", {
    query_embedding: toPgVectorLiteral(queryEmbedding),
    match_count: MATCH_COUNT,
  });

  if (error) {
    throw error;
  }

  return ((data ?? []) as RetrievedChunk[]).map((row) => ({
    content: row.content,
    url: row.url ?? null,
    title: row.title ?? null,
    similarity: row.similarity ?? null,
  }));
}

async function retrieveWithFallback(queryEmbedding: number[]) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_chunks")
    .select("content, url, title, embedding")
    .limit(250);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row: Record<string, unknown>) => {
      const embedding = parseStoredVector(row.embedding);
      if (!embedding) {
        return null;
      }

      return {
        content: String(row.content ?? ""),
        url: row.url ? String(row.url) : null,
        title: row.title ? String(row.title) : null,
        similarity: cosineSimilarity(queryEmbedding, embedding),
      } satisfies RetrievedChunk;
    })
    .filter((row): row is RetrievedChunk => Boolean(row))
    .sort((left, right) => (right.similarity ?? -1) - (left.similarity ?? -1))
    .slice(0, MATCH_COUNT);
}

export async function retrieveRelevantChunks(query: string) {
  const openai = getOpenAIClient();
  const embedding = await embedTexts(openai, [query]);
  const queryEmbedding = embedding[0];

  try {
    return await retrieveWithRpc(queryEmbedding);
  } catch (error) {
    console.warn("match_site_chunks RPC unavailable, using JS similarity fallback.", error);
    return retrieveWithFallback(queryEmbedding);
  }
}

export function buildContextBlock(chunks: RetrievedChunk[]) {
  if (chunks.length === 0) {
    return "No indexed portfolio context was found.";
  }

  return chunks
    .map((chunk, index) => {
      const label = chunk.title || chunk.url || `Source ${index + 1}`;
      return `[${index + 1}] ${label}\n${chunk.content}`;
    })
    .join("\n\n");
}
