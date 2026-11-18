import { forwardRef, useState, type ReactNode, type SelectHTMLAttributes } from "react";
import { FormField, fieldClass, nextFieldId } from "./FormField";

/**
 * Select — pick from a list.
 *
 * Props: placeholder? (the first, empty option), options: {value, label}[]
 * OR <option> children (both work), label?, required?, hint?,
 * error?, className? + <select> props.
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  children?: ReactNode;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, children, placeholder, label, hint, error, required, className = "", id, ...rest },
  ref,
) {
  const [fallbackId] = useState(() => nextFieldId("select"));
  const fieldId = id ?? fallbackId;
  return (
    <FormField label={label} required={required} hint={hint} error={error} htmlFor={fieldId}>
      <select
        ref={ref}
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={fieldClass(error, `appearance-none pr-10 ${className}`)}
        {...rest}
      >
        {placeholder !== undefined && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {Array.isArray(options)
          ? options.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))
          : children}
      </select>
    </FormField>
  );
});
