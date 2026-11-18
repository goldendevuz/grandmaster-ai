import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { FormField, fieldClass, nextFieldId } from "./FormField";

/**
 * Input — a plain text field (name, address, search…).
 *
 * Props: label?, required?, hint?, error?, className? (on the field) +
 * all of <input>'s plain props (value, onChange, placeholder, name…).
 * Use PhoneInput for a phone and EmailInput for an email.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, className = "", id, type = "text", ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("input"));
  const fieldId = id ?? fallbackId;
  return (
    <FormField label={label} required={required} hint={hint} error={error} htmlFor={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        className={fieldClass(error, className)}
        {...rest}
      />
    </FormField>
  );
});
