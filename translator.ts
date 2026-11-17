import { getLanguage, type Language } from "./languages.ts";

export type TranslationResult = {
  text: string;
  provider: "n-atlas" | "gpt-4o-mini" | "mymemory";
};

async function getJson(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// PLACEHOLDER request shape: replace when we get the real N-ATLAS docs
async function viaNAtlas(text: string, from: Language, to: Language) {
  const url = process.env.N_ATLAS_URL;
  const key = process.env.N_ATLAS_API_KEY;
  if (!url || !key) throw new Error("N-ATLAS not set up yet");
  const data = await getJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ text, source: from.code, target: to.code }),
  });
  if (!data.translation) throw new Error("No translation returned");
  return data.translation as string;
}

async function viaGpt(text: string, from: Language, to: Language) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OpenAI key missing");
  const data = await getJson("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Translate from " + from.name + " to " + to.name + ". Reply with only the translation." },
        { role: "user", content: text },
      ],
    }),
  });
  return data.choices[0].message.content.trim() as string;
}

async function viaMyMemory(text: string, from: Language, to: Language) {
  const q = encodeURIComponent(text);
  const url = "https://api.mymemory.translated.net/get?q=" + q + "&langpair=" + from.code + "|" + to.code;
  const data = await getJson(url, {});
  return data.responseData.translatedText as string;
}

export async function translate(text: string, fromCode: string, toCode: string): Promise<TranslationResult> {
  const from = getLanguage(fromCode);
  const to = getLanguage(toCode);
  if (!from || !to) throw new Error("Unsupported language code");

  const providers = [
    { name: "n-atlas", run: viaNAtlas },
    { name: "gpt-4o-mini", run: viaGpt },
    { name: "mymemory", run: viaMyMemory },
  ] as const;

  for (const p of providers) {
    try {
      const out = await p.run(text, from, to);
      return { text: out, provider: p.name };
    } catch (err) {
      console.log(p.name + " failed, trying next:", (err as Error).message);
    }
  }
  throw new Error("All translation providers failed");
}