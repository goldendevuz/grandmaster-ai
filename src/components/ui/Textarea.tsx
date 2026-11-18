import { forwardRef, useState, type TextareaHTMLAttributes } from "react";
import { FormField, fieldClass, nextFieldId } from "./FormField";

/**
 * Textarea — multi-line text (a note, a message).
 *
 * Props: label?, required?, hint?, error?, className?, rows? (default 4) +
 * plain <textarea> props.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, className = "", id, rows = 4, ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("textarea"));
  const fieldId = id ?? fallbackId;
  return (
    <FormField label={label} required={required} hint={hint} error={error} htmlFor={fieldId}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        className={fieldClass(error, `resize-y ${className}`)}
        {...rest}
      />
    </FormField>
  );
});
