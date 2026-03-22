export type Language = {
  code: string;
  flag: string;
  nativeName: string;
  englishName: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", flag: "🇬🇧", nativeName: "English", englishName: "English" },
  { code: "de", flag: "🇩🇪", nativeName: "Deutsch", englishName: "German" },
  { code: "tr", flag: "🇹🇷", nativeName: "Türkçe", englishName: "Turkish" },
  { code: "pl", flag: "🇵🇱", nativeName: "Polski", englishName: "Polish" },
  { code: "ar", flag: "🇸🇦", nativeName: "العربية", englishName: "Arabic" },
  { code: "fa", flag: "🇮🇷", nativeName: "فارسی", englishName: "Persian" },
  { code: "ro", flag: "🇷🇴", nativeName: "Română", englishName: "Romanian" },
  { code: "uk", flag: "🇺🇦", nativeName: "Українська", englishName: "Ukrainian" },
  { code: "ru", flag: "🇷🇺", nativeName: "Русский", englishName: "Russian" },
  { code: "sr", flag: "🇷🇸", nativeName: "Српски", englishName: "Serbian" },
  { code: "hr", flag: "🇭🇷", nativeName: "Hrvatski", englishName: "Croatian" },
  { code: "bs", flag: "🇧🇦", nativeName: "Bosanski", englishName: "Bosnian" },
  { code: "sq", flag: "🇦🇱", nativeName: "Shqip", englishName: "Albanian" },
  { code: "bg", flag: "🇧🇬", nativeName: "Български", englishName: "Bulgarian" },
  { code: "fr", flag: "🇫🇷", nativeName: "Français", englishName: "French" },
  { code: "es", flag: "🇪🇸", nativeName: "Español", englishName: "Spanish" },
  { code: "it", flag: "🇮🇹", nativeName: "Italiano", englishName: "Italian" },
  { code: "nl", flag: "🇳🇱", nativeName: "Nederlands", englishName: "Dutch" },
  { code: "pt", flag: "🇵🇹", nativeName: "Português", englishName: "Portuguese" },
  { code: "sv", flag: "🇸🇪", nativeName: "Svenska", englishName: "Swedish" },
  { code: "no", flag: "🇳🇴", nativeName: "Norsk", englishName: "Norwegian" },
  { code: "da", flag: "🇩🇰", nativeName: "Dansk", englishName: "Danish" },
  { code: "fi", flag: "🇫🇮", nativeName: "Suomi", englishName: "Finnish" },
  { code: "el", flag: "🇬🇷", nativeName: "Ελληνικά", englishName: "Greek" },
  { code: "he", flag: "🇮🇱", nativeName: "עברית", englishName: "Hebrew" },
  { code: "hi", flag: "🇮🇳", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "bn", flag: "🇧🇩", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "ur", flag: "🇵🇰", nativeName: "اردو", englishName: "Urdu" },
  { code: "ne", flag: "🇳🇵", nativeName: "नेपाली", englishName: "Nepali" },
  { code: "si", flag: "🇱🇰", nativeName: "සිංහල", englishName: "Sinhala" },
  { code: "zh", flag: "🇨🇳", nativeName: "中文", englishName: "Chinese" },
  { code: "ja", flag: "🇯🇵", nativeName: "日本語", englishName: "Japanese" },
  { code: "ko", flag: "🇰🇷", nativeName: "한국어", englishName: "Korean" },
  { code: "vi", flag: "🇻🇳", nativeName: "Tiếng Việt", englishName: "Vietnamese" },
  { code: "th", flag: "🇹🇭", nativeName: "ไทย", englishName: "Thai" },
  { code: "id", flag: "🇮🇩", nativeName: "Bahasa Indonesia", englishName: "Indonesian" },
  { code: "ms", flag: "🇲🇾", nativeName: "Bahasa Melayu", englishName: "Malay" },
  { code: "fil", flag: "🇵🇭", nativeName: "Filipino", englishName: "Filipino" },
  { code: "tl", flag: "🇵🇭", nativeName: "Tagalog", englishName: "Tagalog" },
  { code: "uz", flag: "🇺🇿", nativeName: "Oʻzbek", englishName: "Uzbek" },
  { code: "kk", flag: "🇰🇿", nativeName: "Қазақша", englishName: "Kazakh" },
  { code: "sw", flag: "🇰🇪", nativeName: "Kiswahili", englishName: "Swahili" },
  { code: "am", flag: "🇪🇹", nativeName: "አማርኛ", englishName: "Amharic" },
  { code: "ti", flag: "🇪🇷", nativeName: "ትግርኛ", englishName: "Tigrinya" },
  { code: "ta", flag: "🇮🇳", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "te", flag: "🇮🇳", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "mr", flag: "🇮🇳", nativeName: "मराठी", englishName: "Marathi" },
  { code: "gu", flag: "🇮🇳", nativeName: "ગુજરાતી", englishName: "Gujarati" },
  { code: "pa", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "ha", flag: "🇳🇬", nativeName: "Hausa", englishName: "Hausa" },
  { code: "so", flag: "🇸🇴", nativeName: "Soomaali", englishName: "Somali" },
  { code: "yo", flag: "🇳🇬", nativeName: "Yorùbá", englishName: "Yoruba" },
  { code: "ka", flag: "🇬🇪", nativeName: "ქართული", englishName: "Georgian" }
];

export function getLanguage(code?: string): Language {
  const fallback = LANGUAGES[0];
  if (!code) return fallback;
  return LANGUAGES.find((l) => l.code === code) ?? fallback;
}
