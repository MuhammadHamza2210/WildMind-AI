---
title: WildMind AI
emoji: 🦉
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🦉 WildMind AI

> 🔴 **Live demo:** **https://muhammadhamza221003-wildmind-ai.hf.space**

An AI-powered wildlife encyclopedia. Search any animal and WildMind generates a rich,
streaming summary. It supports **two AI backends** and picks one automatically:

- **Google Gemini** (cloud, recommended) — very fast, used when `VITE_GEMINI_API_KEY` is set.
- **Local Llama 3.2 via [Ollama](https://ollama.com)** — fully offline, used as the fallback.

Reference data comes from a curated dataset + Wikipedia; imagery from Pexels.

Built with **React 18 + Vite**, **React Router v6**, **Framer Motion**, **Tailwind CSS**,
and **Lucide** icons.

---

## ✨ Features

- **Home** — cinematic hero, instant search, featured species and live stats.
- **Explore** — a curated, filterable grid spanning mammals, birds, reptiles, marine life and insects.
- **Animal Profile** — AI-streamed encyclopedia entry (Overview, Habitat, Diet, Reproduction,
  Threats & Conservation, Fascinating Facts), Wikipedia taxonomy, Pexels imagery, a conservation
  badge parsed from the article, and related-animal suggestions.
- **AI Chat** — full conversational naturalist with streaming replies, history, starter prompts
  and a typing indicator.
- **Endangered Tracker** — detailed cards for 10 imperilled species with population bars and
  global threat stats.
- Glassmorphism design system, neon-bioluminescent accents, page transitions, fully responsive
  down to 375px.

---

## 🚀 Setup

### 1. Prerequisites

- **Node.js 18+** and npm
- A free **Pexels API key** → https://www.pexels.com/api/
- **An AI backend** — choose one:
  - **Google Gemini** (recommended, fast): a free API key from https://aistudio.google.com/app/apikey
  - **Ollama** (local, offline): installed and running → https://ollama.com/download

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and add your Pexels key:

```bash
cp .env.example .env
```

Then edit `.env` (keys are **server-side**, with NO `VITE_` prefix so they never reach the browser):

```
PEXELS_API_KEY=your_pexels_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> `.env` is git-ignored and never committed. Because these vars are **not** `VITE_`-prefixed, Vite
> cannot bundle them into the browser — they are read only by the Express proxy in `server/index.js`.
> The frontend talks to `/api/*`, never to Pexels/Gemini directly. ✅

### 4. Choose your AI backend

WildMind uses **Gemini through the proxy by default**, and **automatically falls back to local
Ollama** if Gemini fails. Force a backend with `VITE_AI_PROVIDER=gemini` or `VITE_AI_PROVIDER=ollama`.

> **Automatic failover:** when a Gemini request fails before any text streams (e.g. a `429`
> free-tier quota error, or the proxy isn't running), WildMind transparently retries the same
> request on local Ollama and shows a small "now using the local model" notice. Keep Ollama
> running in the background if you want this safety net.

**Option A — Google Gemini (recommended, fast):**
Put your key in `GEMINI_API_KEY` in `.env`. The proxy streams it from the cloud
(default model `gemini-flash-latest`, override with `GEMINI_MODEL`). Requires internet.

**Option B — Local Ollama (offline):**
Set `VITE_AI_PROVIDER=ollama` (or just leave `GEMINI_API_KEY` blank and rely on failover) and run
Ollama with a model pulled:

```bash
ollama pull llama3.2:1b
ollama run llama3.2:1b
```

> The Ollama path defaults to **`llama3.2:1b`** (1.3 GB) for speed on CPU — the app keeps the model
> loaded (`keep_alive`), pre-warms it on startup, and caps output length. For richer (slower)
> writing, pull `llama3.2:3b` or `llama3.1` and change `MODEL` in `src/services/ollama.js`.
> Either way, the **Quick Facts** panel renders instantly from the local dataset.

When using Ollama it serves its REST API at `http://localhost:11434` — WildMind talks to
`http://localhost:11434/api/generate` and streams the response token by token.

### 5. Run it

```bash
npm run dev
```

This starts **both** the Express key-proxy (port 3001) and the Vite dev server (port 5173)
together. Open the URL Vite prints (default http://localhost:5173).

> Keys never reach the browser: the frontend calls `/api/*`, which Vite proxies to the Express
> server, which adds the secret keys and forwards the request to Pexels / Gemini.

---

## 🛠️ Available scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the API proxy **and** the Vite dev server        |
| `npm run client`  | Start only the Vite dev server                         |
| `npm run server`  | Start only the Express API proxy                       |
| `npm run build`   | Production build into `dist/`                           |
| `npm start`       | Run the Express server, serving `dist/` + the API      |
| `npm run preview` | Preview the production build (Vite)                     |

**Production:** `npm run build` then `npm start` — the Express server serves the built site and
the API together on one port (3001), so the keys stay server-side in production too.

---

## 📁 Project structure

```
server/
  index.js      Express proxy — holds the Pexels & Gemini keys, serves dist in production
src/
  pages/        Home, ExplorePage, AnimalProfile, ChatPage, EndangeredPage
  components/   Navbar, AnimalCard, ConservationBadge, SearchBar, LoadingSkeleton, StreamingText
  services/     ai.js (facade + failover), gemini.js, ollama.js, wikipedia.js, pexels.js
  data/         animals.js (curated dataset — source of truth for classes & facts)
  hooks/        useAnimalData.js, useOllamaStream.js
  App.jsx       Routing + page transitions
  main.jsx      Entry point
  index.css     Tailwind + design-system styles
```

---

## 🔒 How API keys are kept private

WildMind keeps both keys **server-side** so they never reach the browser:

- **In source control:** `.env` is git-ignored; only `.env.example` (placeholders) is tracked. ✅
- **In the browser:** the keys use **non-`VITE_`** env names (`PEXELS_API_KEY`, `GEMINI_API_KEY`),
  so Vite cannot inline them into the JS bundle. The frontend only ever calls same-origin
  `/api/*` routes. ✅
- **The Express proxy** (`server/index.js`) is the only place the keys are read. It adds them to
  outgoing requests to Pexels / Gemini and streams the result back. In production (`npm start`) the
  same server serves the built site **and** the API on one port, so the keys stay server-side there
  too — not just in dev.

You can confirm nothing leaked after a build with:

```bash
npm run build
# then search dist/ for your key — it should NOT appear:
grep -r "YOUR_KEY_PREFIX" dist/   # (returns nothing)
```

> Ollama runs locally on `http://localhost:11434` and uses no key, so there's no secret on that path.

## ⚠️ Keys shared in chat

The keys currently in `.env` were pasted into a conversation, so treat them as compromised and
**rotate them** when convenient — Gemini at https://aistudio.google.com/app/apikey, Pexels at
https://www.pexels.com/api/. Paste the new values into `.env` (the proxy picks them up on restart).

## 🧩 Troubleshooting

- **"Couldn’t reach the AI model"** — Ollama isn’t running or `llama3.2:1b` isn’t pulled.
  Run `ollama run llama3.2:1b` and retry.
- **Responses feel slow** — you’re likely on a bigger model. The fastest option is `llama3.2:1b`
  (the default). The very first request of a session also pays a one-time model-load cost.
- **AI or images not working / `/api` 404s** — the Express proxy isn't running. Use `npm run dev`
  (which starts both server and client), not `npm run client` alone.
- **Images not loading** — your Pexels key is missing or rate-limited; a placeholder image is shown.
- **CORS errors from Ollama** — recent Ollama versions allow `localhost` origins by default. If you
  hit CORS issues, start Ollama with `OLLAMA_ORIGINS=*` set in the environment.

---

## 📜 Notes

- No TypeScript — plain JSX only.
- The markdown in AI responses is rendered by a small built-in regex parser (no markdown library).
- Population and conservation figures are approximate, drawn from IUCN Red List / WWF estimates.
