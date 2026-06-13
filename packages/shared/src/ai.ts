export async function callOpenAiJson<T>(
  apiKey: string,
  systemPrompt: string,
  userContent: string | Array<{ type: string; text?: string; image_url?: { url: string; detail?: string } }>,
  options?: { model?: string; maxTokens?: number },
): Promise<T> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model ?? "gpt-4o",
      max_tokens: options?.maxTokens ?? 4096,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: userContent,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No response from model");
  }

  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export async function callOpenAiText(
  apiKey: string,
  systemPrompt: string,
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  options?: { model?: string; maxTokens?: number },
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model ?? "gpt-4o",
      max_tokens: options?.maxTokens ?? 2048,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response from model");
  return content.trim();
}
