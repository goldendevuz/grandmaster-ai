import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { nextFieldId } from "./FormField";

/**
 * Checkbox — a tick box (consent, subscription…).
 *
 * Props: label (text or JSX), error?, className? + <input type="checkbox">
 * props (checked, onChange, name…).
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className = "", id, required, ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("checkbox"));
  const fieldId = id ?? fallbackId;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={fieldId} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-base text-gray-800">
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          className="h-5 w-5 shrink-0 rounded border-gray-300 accent-[color:var(--accent)]"
          {...rest}
        />
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
