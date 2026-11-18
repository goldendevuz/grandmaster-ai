import type { ReactNode } from "react";

/**
 * FormField — label + field + error/hint. Every ui field is drawn through
 * it, so all forms look the same.
 *
 * Props: label?, required? (* next to the label), hint?, error? (red text,
 * in place of the hint), htmlFor?, className?, children (the field itself).
 */
export interface FormFieldProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function FormField({ label, required, hint, error, htmlFor, className = "", children }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-gray-800">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

/** Classes shared by every field (a red border on error). */
export function fieldClass(error?: string, extra = ""): string {
  const base =
    "w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 " +
    "outline-none transition focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] " +
    "disabled:cursor-not-allowed disabled:opacity-60";
  return `${base} ${error ? "border-red-500" : "border-gray-300"} ${extra}`.trim();
}

/** A stable id for a field given none. */
let fieldCounter = 0;
export function nextFieldId(prefix: string): string {
  fieldCounter += 1;
  return `${prefix}-${fieldCounter}`;
}
