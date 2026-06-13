import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  callOpenAiAnalyze,
  chatWithAuditContext,
  enrichAnalysisWithLiveStores,
  generateAuditInsights,
  generateContractorEstimate,
  identifyPlantInCrop,
  type AuditInsights,
  type ChatMessage,
  type LawnAnalysis,
  type LawnZone,
} from "@terraview/shared";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
config({ path: path.join(rootDir, ".env") });

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      if (/^http:\/\/localhost:\d+$/.test(origin)) return origin;
      if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return origin;
      return null;
    },
  }),
);

function openAiKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return apiKey;
}

function parseZip(zipCode: unknown): string | null {
  if (typeof zipCode !== "string") return null;
  const zip = zipCode.trim().slice(0, 10);
  return /^\d{5}$/.test(zip) ? zip : null;
}

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/analyze", async (c) => {
  const apiKey = openAiKey();
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: { image?: string; zipCode?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.image?.startsWith("data:image/")) {
    return c.json({ error: "Expected { image: data URL }" }, 400);
  }

  const zipCode =
    typeof body.zipCode === "string" && body.zipCode.trim()
      ? body.zipCode.trim().slice(0, 10)
      : undefined;

  try {
    const result = await callOpenAiAnalyze(body.image, apiKey, zipCode);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return c.json({ error: message }, 502);
  }
});

app.post("/api/stores/enrich", async (c) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return c.json({ error: "GOOGLE_MAPS_API_KEY not configured on server" }, 500);
  }

  let body: { analysis?: unknown; zipCode?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const zipCode = parseZip(body.zipCode);
  if (!zipCode) {
    return c.json({ error: "Expected { analysis, zipCode: 5-digit US ZIP }" }, 400);
  }

  if (!body.analysis || typeof body.analysis !== "object") {
    return c.json({ error: "Expected analysis object" }, 400);
  }

  try {
    const result = await enrichAnalysisWithLiveStores(
      body.analysis as LawnAnalysis,
      zipCode,
      apiKey,
    );
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Store lookup failed";
    return c.json({ error: message }, 502);
  }
});

app.post("/api/insights", async (c) => {
  const apiKey = openAiKey();
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: { analysis?: unknown; zipCode?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const zipCode = parseZip(body.zipCode);
  if (!zipCode || !body.analysis || typeof body.analysis !== "object") {
    return c.json({ error: "Expected { analysis, zipCode }" }, 400);
  }

  try {
    const result = await generateAuditInsights(
      body.analysis as LawnAnalysis,
      zipCode,
      apiKey,
    );
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Insights generation failed";
    return c.json({ error: message }, 502);
  }
});

app.post("/api/contractor-estimate", async (c) => {
  const apiKey = openAiKey();
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: { analysis?: unknown; zone?: unknown; zipCode?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const zipCode = parseZip(body.zipCode);
  if (!zipCode || !body.analysis || !body.zone) {
    return c.json({ error: "Expected { analysis, zone, zipCode }" }, 400);
  }

  try {
    const result = await generateContractorEstimate(
      body.zone as LawnZone,
      body.analysis as LawnAnalysis,
      zipCode,
      apiKey,
    );
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Estimate failed";
    return c.json({ error: message }, 502);
  }
});

app.post("/api/identify-plant", async (c) => {
  const apiKey = openAiKey();
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: { image?: string; zone?: unknown; zipCode?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const zipCode = parseZip(body.zipCode);
  if (!zipCode || !body.zone || !body.image?.startsWith("data:image/")) {
    return c.json({ error: "Expected { image, zone, zipCode }" }, 400);
  }

  try {
    const result = await identifyPlantInCrop(
      body.image,
      body.zone as LawnZone,
      zipCode,
      apiKey,
    );
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Plant identification failed";
    return c.json({ error: message }, 502);
  }
});

app.post("/api/chat", async (c) => {
  const apiKey = openAiKey();
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: {
    analysis?: unknown;
    messages?: ChatMessage[];
    zipCode?: string;
    insights?: AuditInsights | null;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.analysis || !Array.isArray(body.messages) || body.messages.length === 0) {
    return c.json({ error: "Expected { analysis, messages }" }, 400);
  }

  const zipCode = parseZip(body.zipCode) ?? undefined;

  try {
    const reply = await chatWithAuditContext(
      body.analysis as LawnAnalysis,
      body.messages,
      apiKey,
      zipCode,
      body.insights ?? null,
    );
    return c.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return c.json({ error: message }, 502);
  }
});

const port = Number(process.env.PORT ?? 3001);

console.log(`Terraview API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
