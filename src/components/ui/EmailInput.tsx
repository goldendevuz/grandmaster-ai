import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { FormField, fieldClass, nextFieldId } from "./FormField";

/**
 * EmailInput — an email field. Checked when the field loses focus (blur)
 * and on submit (isValidEmail): an "@", at least 1 character before it, then
 * a domain and at least 2 letters after the dot. a@b → invalid, a@b.co → valid.
 *
 * Props: value, onChange (like a plain input), label?, required?, hint?,
 * error? (from outside — wins), errorText? (its own check's message; the
 * default follows <html lang>, see TEXTS), className? + <input> props.
 */
/** The default "invalid email" message per <html lang>; English otherwise. */
const TEXTS: Record<string, string> = {
  en: "Invalid email",
  ru: "Неверный email",
  uz: "Email not\u02bbg\u02bbri",
  es: "Correo no válido",
  tr: "Geçersiz e-posta",
};

function defaultErrorText(): string {
  const lang = (typeof document !== "undefined" ? document.documentElement.lang : "").slice(0, 2);
  return TEXTS[lang] ?? TEXTS.en;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(String(value ?? "").trim());
}

export interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  errorText?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(function EmailInput(
  { label, hint, error, errorText, required, className = "", id, onBlur, onChange, ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("email"));
  const [ownError, setOwnError] = useState("");
  const fieldId = id ?? fallbackId;
  const shownError = error || ownError;
  return (
    <FormField label={label} required={required} hint={hint} error={shownError} htmlFor={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        type="email"
        inputMode="email"
        autoComplete="email"
        required={required}
        aria-invalid={shownError ? true : undefined}
        className={fieldClass(shownError, className)}
        onChange={(e) => {
          if (ownError && isValidEmail(e.target.value)) setOwnError("");
          onChange?.(e);
        }}
        onBlur={(e) => {
          const v = e.target.value.trim();
          setOwnError(v && !isValidEmail(v) ? errorText ?? defaultErrorText() : "");
          onBlur?.(e);
        }}
        {...rest}
      />
    </FormField>
  );
});
