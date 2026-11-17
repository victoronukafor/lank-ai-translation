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
