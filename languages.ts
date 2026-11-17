export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "wo", name: "Wolof", nativeName: "Wolof" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "fr", name: "French", nativeName: "Français" },
];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}