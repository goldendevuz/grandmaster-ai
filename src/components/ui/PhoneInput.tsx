import {
  forwardRef,
  useEffect,
  useState,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { FormField, fieldClass, nextFieldId } from "./FormField";
import { countryByIso, defaultCountryIso } from "./countryCodes";
import { digitsFromPaste, formatPhone, onlyDigits, phoneInfo } from "./phoneFormat";

/**
 * PhoneInput — an international phone field. The AI does NOT write the mask — this component is it.
 *
 * - The field always has "+"; only digits are typed (letters are dropped).
 * - Formats while typing: 998887654323 → "+998 88 765 43 23".
 * - The country code is detected from the leading digits (countryCodes.ts, ~240 countries).
 * - Entering an empty field puts in the default code: defaultCountry (ISO2) or
 *   the site's language (<html lang>: uz → +998, ru → +7, en → +1); any other language → "+".
 * - Paste: "+998 (88) 765-43-23", "00998…", "8 916…" (RU/KZ) — normalized.
 * - The caret always stays at the END (typing in the middle is not supported — simple and stable).
 *
 * Props: value (E.164 "+998887654323" or ""), onChange(e164, {country,
 * iso, valid}), label?, required?, hint?, error?, defaultCountry? ("UZ"),
 * placeholder? (default — that country's code), className?, name?, disabled?.
 * Do NOT write a format hint ("Format: +998 …") on the page — the field
 * shows it itself.
 * The form receives E.164 (no spaces).
 */
export interface PhoneMeta {
  country: string | null;
  iso: string | null;
  valid: boolean;
}

export interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: string;
  onChange: (e164: string, meta: PhoneMeta) => void;
  label?: string;
  hint?: string;
  error?: string;
  /** ISO2 ("UZ"); when not given, from the site's language. */
  defaultCountry?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { value, onChange, label, hint, error, required, className = "", id, placeholder, defaultCountry, onFocus, onBlur, ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("phone"));
  const [focused, setFocused] = useState(false);
  const fieldId = id ?? fallbackId;
  const digits = onlyDigits(value ?? "");
  const shown = digits ? formatPhone(digits) : focused ? "+" : "";
  // Read after mount: the page is pre-rendered on the server, where there is
  // no document to read the site's language from.
  const [presetIso, setPresetIso] = useState<string | null>(defaultCountry ?? null);
  useEffect(() => {
    setPresetIso(defaultCountry ?? defaultCountryIso());
  }, [defaultCountry]);
  const preset = presetIso ? countryByIso(presetIso) : null;
  const hintText = placeholder ?? (preset ? "+" + preset.dial : "+");

  const emit = (next: string) => {
    const info = phoneInfo(next);
    onChange?.(info.e164, { country: info.country, iso: info.iso, valid: info.valid });
  };

  const moveCaretToEnd = (el: HTMLInputElement) => {
    requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
  };

  return (
    <FormField label={label} required={required} hint={hint} error={error} htmlFor={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder={hintText}
        required={required}
        aria-invalid={error ? true : undefined}
        className={fieldClass(error, className)}
        value={shown}
        onChange={(e) => {
          emit(onlyDigits(e.target.value));
          moveCaretToEnd(e.target);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          // A space in the display is not a digit: Backspace always takes
          // the last DIGIT, so it never gets stuck on a separator.
          if (e.key === "Backspace") {
            e.preventDefault();
            emit(digits.slice(0, -1));
          }
        }}
        onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
          e.preventDefault();
          emit(digitsFromPaste(e.clipboardData.getData("text")));
          moveCaretToEnd(e.currentTarget);
        }}
        onFocus={(e) => {
          setFocused(true);
          // An empty field starts with the site's country code.
          if (!digits && preset) emit(preset.dial);
          moveCaretToEnd(e.currentTarget);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </FormField>
  );
});
