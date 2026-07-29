// These types intentionally mirror backend/app/schemas/translation.py field-for-field.
// Keeping frontend and backend contracts in sync manually like this is fine at our
// scale; larger teams often auto-generate this file from the OpenAPI spec instead.

export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}

export interface TranslationResponse {
  translated_text: string;
  source_lang: string;
  target_lang: string;
}

export interface Language {
  code: string;
  name: string;
}

// A small, curated list is more reliable for a portfolio demo than trying to
// support all 200+ codes MyMemory technically accepts.
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "auto", name: "Auto-detect" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ur", name: "Urdu" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ru", name: "Russian" },
];