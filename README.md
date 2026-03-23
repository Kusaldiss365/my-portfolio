# Kusal Dissanayake Portfolio

Personal portfolio website built with React, TypeScript, Vite, Supabase, OpenAI, and Vercel.

## Overview

This project includes:

- a portfolio website
- a floating AI chat assistant
- Supabase-backed chat session logging
- RAG indexing into Supabase with embeddings
- a hybrid response strategy:
  - prefer indexed Supabase RAG context
  - fall back to default portfolio context when retrieval is weak or empty

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- OpenAI API
- Vercel serverless functions

## Features

- recruiter-focused portfolio website
- AI chat assistant for:
  - skills
  - experience
  - education
  - achievements
  - projects
  - contact details
  - booking requests
- chat history awareness for follow-up questions
- Google Calendar booking link support
- automatic chat scrolling to the latest message
- Supabase RAG indexing with embeddings and chunk retrieval
- fallback portfolio context for resilience

## API Routes

### `/api/chat`

Handles chatbot replies.

What it does:

- accepts the latest user message, visitor name, and recent chat history
- embeds the latest user query
- retrieves the top matching chunks from `site_chunks`
- builds the final prompt using:
  - retrieved indexed context when available
  - fallback portfolio context when retrieval is incomplete
- returns:
  - `reply`
  - `rag` metadata for debugging

RAG metadata includes:

- `usedSupabaseContext`
- `sourceCount`
- `sources`

### `/api/reindex`

Indexes portfolio content into Supabase.

What it does:

- crawls the deployed portfolio site at each deployment
- extracts clean text from fetched HTML
- adds source-backed fallback documents
- hashes each page
- skips unchanged pages only when chunk rows already exist
- splits text into chunks
- generates embeddings
- stores page records in `site_pages`
- stores chunk records in `site_chunks`

### `/api/rag`

Shared RAG utilities used by both `/api/chat` and `/api/reindex`.

Includes:

- crawling
- content hashing
- chunking
- embedding generation
- Supabase retrieval
- JS fallback similarity search if RPC is unavailable

## Why Hybrid RAG Is Used

The live site is a Vite client-rendered SPA. Crawling the deployed HTML alone is not enough to guarantee complete content extraction because most visible content is rendered client-side.

To make the chatbot reliable:

- live site crawling is still used
- source-backed fallback pages are also indexed
- `/api/chat` can fall back to default portfolio context if retrieval misses

This means:

- Supabase RAG can be used when indexed chunks are available
- the bot still answers correctly when live crawl coverage is incomplete

## Supabase Tables

This project uses at least these tables:

- `chat_sessions`
- `chat_messages`
- `site_pages`
- `site_chunks`

Expected RAG-related columns include:

### `site_pages`

- `id`
- `url`
- `title`
- `content`
- `raw_text`
- `content_hash`
- `last_crawled_at`
- `last_indexed_at`

### `site_chunks`

- `id`
- `page_id`
- `url`
- `title`
- `chunk_index`
- `content`
- `chunk_text`
- `content_hash`
- `embedding`

Important:

- this project was adapted on top of an older schema
- some databases may still contain legacy columns like `raw_text` and `chunk_text`
- the current code supports those older fields to avoid migration breakage

## Required Environment Variables

### Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_CALENDAR_BOOKING_URL`

### Server

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`
- `GOOGLE_CALENDAR_BOOKING_URL`

See [`.env.example`]

## Local Development

Install dependencies:

```bash
npm install
```

Run the Vite app:

```bash
npm run dev
```

Build locally:

```bash
npm run build
```

## Reindex Flow

To index portfolio content:

```bash
curl -X POST http://localhost:3000/api/reindex
```

Production:

```bash
curl -X POST https://www.kusaldissanayake.com/api/reindex
```

Typical response:

```json
{
  "siteUrl": "https://www.kusaldissanayake.com",
  "crawledPages": 1,
  "sourcePages": 2,
  "totalPagesConsidered": 3,
  "indexedPages": 3,
  "skippedPages": 0,
  "chunkCount": 7
}
```

## How To Verify RAG Is Working

### 1. Check chunk count in Supabase

```sql
select count(*) from public.site_chunks;
```

If this is `0`, Supabase RAG is not usable.

### 2. Test `/api/chat`

Example:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"What are Kusal's backend skills?\",\"visitorName\":\"Test User\",\"history\":[]}"
```

Look for:

```json
"rag": {
  "usedSupabaseContext": true,
  "sourceCount": 6,
  "sources": [...]
}
```

Interpretation:

- `usedSupabaseContext: true` means indexed Supabase chunks were retrieved
- `usedSupabaseContext: false` means the answer relied only on fallback context

## Booking Link Support

Booking is optional and env-driven.

If these are set:

- `GOOGLE_CALENDAR_BOOKING_URL`
- `VITE_GOOGLE_CALENDAR_BOOKING_URL`

Then:

- the contact section shows a `Book a meeting` card
- the chatbot can suggest the booking link for contact and scheduling related questions
- the booking link is included in fallback indexed content after reindex

## Chat Behavior

Current chatbot behavior:

- uses recent chat history for follow-up questions
- prefers indexed RAG context when available
- falls back to portfolio context when needed
- answers only from available portfolio/project data
- formats list-like replies with readable bullets
- keeps skill categories strict
- does not mix unrelated categories unless asked

## Deployment Notes

Deploy on Vercel with the environment variables listed above.

Recommended production flow:

1. Push code
2. Redeploy on Vercel
3. Run `POST /api/reindex`
4. Verify `site_chunks` contains rows
5. Verify `/api/chat` returns `rag.usedSupabaseContext: true`

## Known Constraints

- deployed site crawling is limited because the site is client-rendered
- fallback context is intentionally kept to ensure reliable answers
- some legacy Supabase schema fields may still exist and must be compatible with the current code

## Repo Notes

- `.env` and `.env.*` are ignored
- use `.env.example` as the template
- do not expose `SUPABASE_SERVICE_ROLE_KEY` in any client-side variable
