import { translate, type TranslationResult } from "./translator.ts";

// Languages Whisper handles well. For others (like Igbo) we let Whisper auto-detect.
const WHISPER_LANGS = ["en", "yo", "ha", "fr", "pt", "ar", "sw"];

export async function transcribe(audio: Blob, fromCode: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set yet");

  const form = new FormData();
  form.append("file", audio, "speech.webm");
  form.append("model", "whisper-1");
  if (WHISPER_LANGS.includes(fromCode)) form.append("language", fromCode);

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key },
    body: form,
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("Whisper HTTP " + res.status);
  const data = await res.json();
  if (!data.text) throw new Error("No transcript returned");
  return data.text as string;
}

export type VoiceResult = {
  heard: string;
  translated: string;
  provider: TranslationResult["provider"];
};

// Voice in, translated text out
export async function voiceTranslate(audio: Blob, fromCode: string, toCode: string): Promise<VoiceResult> {
  const heard = await transcribe(audio, fromCode);
  const result = await translate(heard, fromCode, toCode);
  return { heard, translated: result.text, provider: result.provider };
}

// Text in, translated text out (for testing without audio or an OpenAI key)
export async function textTranslate(text: string, fromCode: string, toCode: string): Promise<VoiceResult> {
  const result = await translate(text, fromCode, toCode);
  return { heard: text, translated: result.text, provider: result.provider };
}