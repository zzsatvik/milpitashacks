import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { callOpenAiAnalyze } from "@lawn-audit/shared";

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

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/analyze", async (c) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured on server" }, 500);
  }

  let body: { image?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (!body.image?.startsWith("data:image/")) {
    return c.json({ error: "Expected { image: data URL }" }, 400);
  }

  try {
    const result = await callOpenAiAnalyze(body.image, apiKey);
    return c.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return c.json({ error: message }, 502);
  }
});

const port = Number(process.env.PORT ?? 3001);

console.log(`Lawn Audit API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
