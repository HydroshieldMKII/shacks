import fr from "./fr.json";
import en from "./en.json";

export const locales = {
    fr,
    en,
} as const; // ✅ "as const" fige les clés et les types

export type LocaleKey = keyof typeof locales; // "fr" | "en"
