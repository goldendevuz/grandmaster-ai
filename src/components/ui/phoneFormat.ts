import { detectCountryInfo, groupsByLength, PHONE_GROUPS } from "./countryCodes";

/**
 * Phone number formatting — PURE functions (no DOM); PhoneInput uses them.
 *
 * Stored form: digits only ("998887654323"). Display:
 * "+998 88 765 43 23". What the form sends: E.164 "+998887654323".
 * Spaces exist ONLY in the display. The country is detected from the leading
 * digits (countryCodes.ts, ~240 countries).
 *
 * TEST CASES (internal/sitebuild phone_format_test.go checks them with node):
 *  1. formatPhone("998887654323")      → "+998 88 765 43 23"
 *  2. formatPhone("99888")             → "+998 88"
 *  3. formatPhone("14155552671")       → "+1 415 555 2671"         (US)
 *  4. formatPhone("79161234567")       → "+7 916 123 45 67"        (RU)
 *  5. formatPhone("447400123456")      → "+44 7400 123456"         (GB)
 *  6. formatPhone("99")                → "+99"            (code not known yet)
 *  7. digitsFromPaste("+998 (88) 765-43-23") → "998887654323"
 *  8. digitsFromPaste("00998887654323")      → "998887654323"
 *  9. digitsFromPaste("89161234567")         → "79161234567"  (RU/KZ habit)
 * 10. phoneInfo("99888765432").valid → false; phoneInfo("998887654323").valid → true
 * 11. formatPhone("4915123456789")     → "+49 151 23456789"        (DE)
 * 12. formatPhone("905321234567")      → "+90 532 123 45 67"       (TR)
 * 13. phoneInfo("77011234567").iso     → "KZ"
 * 14. formatPhone("971501234567")      → "+971 50 123 4567"        (AE)
 * 15. formatPhone("919876543210")      → "+91 98765 43210"         (IN)
 * 16. formatPhone("33612345678")       → "+33 6 12 34 56 78"       (FR)
 * 17. formatPhone("821012345678")      → "+82 10 1234 5678"        (KR)
 * 18. formatPhone("5511912345678")     → "+55 11 91234 5678"       (BR)
 */

/** The most digits E.164 allows (code included). */
export const MAX_DIGITS = 15;

/** Digits only, up to the E.164 length. */
export function onlyDigits(value: string): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, MAX_DIGITS);
}

/**
 * Digits from pasted text: the "00" international prefix is dropped,
 * 11 digits starting with "8" (the RU/KZ habit) → "7".
 */
export function digitsFromPaste(text: string): string {
  const raw = String(text ?? "");
  const hasPlus = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!hasPlus && digits.startsWith("00")) digits = digits.slice(2);
  if (!hasPlus && digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  return digits.slice(0, MAX_DIGITS);
}

export interface PhoneInfo {
  /** The dialing code ("998") or null — not detected yet. */
  country: string | null;
  /** The country's ISO2 ("UZ") or null. */
  iso: string | null;
  /** The code was found and the national part's length is right for that country. */
  valid: boolean;
  /** "+998887654323" or "" (empty). */
  e164: string;
}

/** The national part's maximum length (within the E.164 limit). */
export function maxNational(country: string, max = 12): number {
  return Math.min(max, MAX_DIGITS - country.length);
}

/** Digits → display: "+998 88 765 43 23". */
export function formatPhone(digits: string): string {
  const clean = onlyDigits(digits);
  if (!clean) return "";
  const info = detectCountryInfo(clean);
  if (!info) return "+" + clean;
  const national = clean.slice(info.dial.length, info.dial.length + maxNational(info.dial, info.max));
  const groups = PHONE_GROUPS[info.dial] ?? groupsByLength(info.max);
  const parts: string[] = [];
  let rest = national;
  for (let i = 0; i < groups.length && rest; i++) {
    const size = i === groups.length - 1 ? rest.length : groups[i];
    parts.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  return ["+" + info.dial, ...parts].join(" ");
}

/** About the digits: country, validity, E.164. */
export function phoneInfo(digits: string): PhoneInfo {
  const clean = onlyDigits(digits);
  if (!clean) return { country: null, iso: null, valid: false, e164: "" };
  const info = detectCountryInfo(clean);
  if (!info) return { country: null, iso: null, valid: false, e164: "+" + clean };
  const national = clean.slice(info.dial.length);
  const valid = national.length >= info.min && national.length <= info.max;
  return {
    country: info.dial,
    iso: info.iso,
    valid,
    e164: "+" + info.dial + national.slice(0, maxNational(info.dial, info.max)),
  };
}
