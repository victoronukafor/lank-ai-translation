# lank-ai-translation

Translation fallback and voice pipeline for LANK AI, a real-time multilingual voice interpreter built during the SeHIT internship (AI track).

## What it does
- **languages.ts**: the supported language list (English, Igbo, Yoruba, Hausa, Swahili, Amharic, Wolof, Zulu, French).
- **translator.ts**: translates text with a fallback chain: N-ATLAS, then GPT-4o-mini, then MyMemory (free backup). It returns the translated text and which provider answered.
- **pipeline.ts**: speech-to-text with Whisper, then translation, for voice and text input.

## Status
Tested locally. The fallback chain works and returned a Yoruba translation through MyMemory. N-ATLAS and OpenAI need API keys, which are not included in this repo.

## Run
Requires Node.js. Add your own keys as environment variables.
## Usage

```ts
import { translate } from "./translator.ts";
import { voiceTranslate, textTranslate } from "./pipeline.ts";

// Text in, translated text out
const r = await translate("Good morning", "en", "yo");
// r = { text: "...", provider: "n-atlas" | "gpt-4o-mini" | "mymemory" }

// Voice in, translated text out
const v = await voiceTranslate(audioBlob, "ig", "en");
// v = { heard: "...", translated: "...", provider: "..." }

// Text in, translated text out (for testing without audio)
const t = await textTranslate("Good morning", "en", "ha");
```

### Functions

- `translate(text, fromCode, toCode)` returns `{ text, provider }`
- `transcribe(audio: Blob, fromCode)` returns the transcript as a string
- `voiceTranslate(audio: Blob, fromCode, toCode)` returns `{ heard, translated, provider }`
- `textTranslate(text, fromCode, toCode)` returns `{ heard, translated, provider }`

Language codes come from `languages.ts`. An unsupported code throws "Unsupported language code".

### Environment

Set `OPENAI_API_KEY` as an environment variable for voice transcription. If translation keys are missing, `translate` falls back to MyMemory (free).
